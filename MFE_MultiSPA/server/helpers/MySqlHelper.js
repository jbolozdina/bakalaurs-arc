const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "1234",
	database: "bachelor_tests",
});

let connected = false;

const openConnection = async () => {
	console.log(`Attempting connection open on ${connected}`)
	if (!connected) {
		await connection.connect((err) => {
			if (err) throw err;
			this.connected = true;
			console.log("DB connected");
		});
	}
};

const closeConnection = async () => {
	if (connected) {
		await connection.end(() => {
			this.connected = false;
			console.log("DB disconnected");
		});
	}
};

module.exports = { openConnection, closeConnection, connection, connected };
