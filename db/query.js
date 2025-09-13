const pool = require("./pool.js");

async function getMessages(num) {
	const sql = `
        SELECT message, date, username, is_member FROM messages m 
        RIGHT JOIN users_to_messages um 
        ON m.id=um.messageid
        RIGHT JOIN users u ON u.id=um.userid
        LIMIT 10 OFFSET $1;
    `;
	const offset = num ? num * 10 : 0;
	const { rows } = await pool.query(sql, [offset]);
	return rows;
}

async function getUsers(username) {
	const { rows } = await pool.query(
		"SELECT * FROM users WHERE username=($1)",
		[username]
	);
	return rows[0];
}

async function getUser(id) {
	const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
		id,
	]);
	return rows[0];
}

async function addUser(user, password) {
	const { rows } = await pool.query(
		"INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, password",
		[user, password]
	);
	return rows[0];
}

async function createMessage(id, msg) {
	const sql = [
		"INSERT INTO messages (message) VALUES ($1) RETURNING id;",
		"INSERT INTO users_to_messages ( userid, messageid ) VALUES ($1, $2);",
	];
	const msgId = (await pool.query(sql[0], [msg])).rows;
	await pool.query(sql[1], [id, msgId[0].id]);
	const { rows } = await pool.query("SELECT * FROM users_to_messages;");
}

async function giveMembership(id) {
	await pool.query("UPDATE users SET is_member = TRUE WHERE id = $1;", [id]);
}

module.exports = {
	getMessages,
	getUsers,
	getUser,
	addUser,
	createMessage,
	giveMembership,
};
