require("dotenv").config();
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.render("index");
});

const port = process.env.PORT;
app.listen(port || 3000, () => {
	console.log(`Listen on localhost:${port}`);
});
