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

function indexGet(req, res) {
	if (!req.user) return res.redirect("/log-in");
	res.render("index");
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

module.exports = {
	indexGet,
	localStrategy,
	serialize,
	deserialize,
	signInPost,
	logInGet,
};
