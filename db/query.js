const pool = require("./pool.js");

async function getMessages(num) {
	const sql = `
        SELECT message, username FROM messages m 
        LEFT JOIN users_to_messages um 
        ON m.id=um.messageid
        LEFT JOIN users u ON u.id=um.userid
        LIMIT 10 OFFSET $1;
    `;
	const offset = num ? num * 10 : 10;
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

module.exports = {
	getMessages,
	getUsers,
	getUser,
	addUser,
};
