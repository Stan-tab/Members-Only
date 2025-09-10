require("dotenv").config();
const indexRouter = require("express").Router();
const mainController = require("../controllers/mainController.js");
const session = require("express-session");
const passport = require("passport");
const psqlSession = new (require("connect-pg-simple")(session))({
	conString: process.env.TABLE,
});
const { localStrategy } = mainController;

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
indexRouter.post("/sign-in", mainController.signInPost);

module.exports = indexRouter;
