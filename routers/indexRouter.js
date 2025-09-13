require("dotenv").config();
const indexRouter = require("express").Router();
const mainController = require("../controllers/mainController.js");
const session = require("express-session");
const passport = require("passport");
const psqlSession = new (require("connect-pg-simple")(session))({
	conString: process.env.TABLE,
});
const { localStrategy } = mainController; // No 256143

passport.use(localStrategy);
passport.serializeUser(mainController.serialize);
passport.deserializeUser(mainController.deserialize);
indexRouter.use(
	session({
		store: psqlSession,
		name: "userData",
		secret: "do not touch that secret",
		resave: true,
		rolling: true,
		saveUninitialized: false,
		cookie: {
			maxAge: 5 * 60 * 1000,
		},
	})
);

indexRouter.use(passport.session());
indexRouter.get("/", mainController.indexGet);
indexRouter.get("/log-in", mainController.logInGet);
indexRouter.post(
	"/log-in",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/log-in",
	})
);
indexRouter.get("/sign-in", mainController.signInGet);
indexRouter.post("/sign-in", mainController.signInPost);
indexRouter.use("{*splat}", (req, res, next) => {
	if (!req.user) return res.redirect("/");
	next();
});
indexRouter.get("/log-out", mainController.logOut);
indexRouter.get("/new", mainController.createMsgGet);
indexRouter.post("/new", mainController.createMsgPost);
indexRouter.get("/membership", mainController.membershipGet);
indexRouter.post("/membership", mainController.membershipPost);
indexRouter.all("{*splat}", (req, res) => {
	res.send("Hi, we dont have such page so please go back");
});

module.exports = indexRouter;
