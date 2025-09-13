const LocalStrategy = require("passport-local").Strategy;
const db = require("../db/query.js");
const bcrypt = require("bcryptjs");
const localStrategy = new LocalStrategy(async (username, password, done) => {
	try {
		const user = await db.getUsers(username);
		if (!user)
			return done(null, false, { message: "You are not authorised" });
		const match = await bcrypt.compare(password, user.password);
		if (!match)
			return done(null, false, { message: "You are not authorised" });
		return done(null, user);
	} catch (e) {
		done(e);
	}
});
async function serialize(user, done) {
	done(null, user.id);
}
async function deserialize(id, done) {
	try {
		const user = await db.getUser(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
}

async function indexGet(req, res) {
	if (!req.user) return res.redirect("/log-in");
	const { is_member } = await db.getUser(req.user.id);
	let data = await db.getMessages();
	if (!is_member)
		data.map((e) => {
			delete e.date;
			delete e.username;
			return e;
		});
	res.render("index", { user: req.user, msg: data });
}

function logInGet(req, res) {
	res.render("logIn");
}

async function signInPost(req, res, next) {
	const { username, password } = req.body;
	const hashedPass = await bcrypt.hash(password, 10);
	let newUser;
	try {
		newUser = await db.addUser(username, hashedPass);
	} catch (e) {
		return next(e);
	}
	req.logIn(newUser, (e) => {
		if (e) throw new Error("login problem: ", e);
		return res.redirect("/");
	});
}

function signInGet(req, res) {
	res.render("logIn", { action: "Sign-in" });
}

function logOut(req, res) {
	req.logOut((e) => {
		if (e) console.error(e);
		return res.redirect("/");
	});
}

function createMsgGet(req, res) {
	res.render("new");
}

async function createMsgPost(req, res) {
	const { msg } = req.body;
	await db.createMessage(req.user.id, msg);
	res.redirect("/");
}

function membershipGet(req, res) {
	res.render("member");
}

async function membershipPost(req, res) {
	const { code } = req.body;
	const isMatch = await bcrypt.compare(code, process.env.SECRET);
	if (isMatch) {
		await db.giveMembership(req.user.id);
		res.redirect("/");
		return;
	}
	res.redirect("/membership");
}

module.exports = {
	indexGet,
	localStrategy,
	serialize,
	deserialize,
	signInPost,
	logInGet,
	signInGet,
	logOut,
	createMsgGet,
	createMsgPost,
	membershipGet,
	membershipPost,
};
