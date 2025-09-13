const { Client } = require("pg");
require("dotenv").config();

const cl = new Client({
	connectionString: process.env.TABLE,
});

const sql = `
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255) UNIQUE NOT NULL,
    is_member BOOLEAN NOT NULL DEFAULT FALSE,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message TEXT,
    date TIMESTAMPTZ DEFAULT Now()
);
CREATE TABLE IF NOT EXISTS users_to_messages (
    userid INTEGER REFERENCES users(id) NOT NULL,
    messageid INTEGER REFERENCES messages(id) NOT NULL
);
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
