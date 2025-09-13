require("dotenv").config();
const express = require("express");
const app = express();
const indexRouter = require("./routers/indexRouter.js");
// psql members_only < node_modules/connect-pg-simple/table.sql || to activate session

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use("/", indexRouter);
app.use((err, req, res, next) => {
	res.send("OOPs we have an error there go to the main page PLEASE");
	console.error(err);
});

const port = process.env.PORT;
app.listen(port || 4000, () => {
	console.log(`Listen on localhost:${port}`);
});
