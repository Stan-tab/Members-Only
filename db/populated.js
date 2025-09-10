const { Client } = require("pg");
require("dotenv").config();

const cl = new Client({
	connectionString: process.env.TABLE,
});

const sql = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message TEXT
);
CREATE TABLE IF NOT EXISTS users_to_messages (
    userid INTEGER REFERENCES users(id) NOT NULL,
    messageid INTEGER REFERENCES messages(id) NOT NULL
);

INSERT INTO users (username, password) VALUES ( 'anon', 'anon' );
`;

async function main() {
	try {
		console.log("seeding...");
		await cl.connect();
		await cl.query(sql);
		await cl.end();
		console.log("done");
	} catch (e) {
		console.error("Error has been occured", e);
	}
}

main();
