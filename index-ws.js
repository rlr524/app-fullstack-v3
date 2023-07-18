const express = require("express");
const server = require("http").createServer();
const app = express();
const WebSocketServer = require("ws").Server;
const sqlite = require("sqlite3");

app.get("/", (req, res) => {
	res.sendFile("/index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => {
	console.log("Listening on 3000");
});

process.on("SIGINT", () => {
	wss.clients.forEach(function each(client) {
		client.close();
	});
	server.close(() => {
		shutdownDB();
	});
});

/** Websocket */
const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
	const numClients = wss.clients.size;
	console.log("Clients connected", numClients);

	wss.broadcast(`Current visitors: ${numClients}`);

	if (ws.readyState === ws.OPEN) {
		ws.send("Welcome to my server");
	}

	db.run(`INSERT INTO visitors (count, time)
				VALUES (${numClients}, datetime("now"))
	`);

	ws.on("close", function close() {
		wss.broadcast(`Current visitors: ${numClients}`);
		console.log("A client has disconnected");
	});
});

wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.send(data);
	});
};

/** Database */
const db = new sqlite.Database(":memory:");
// const dbFile = new sqlite.Database("./fsfe.db") If wanted to use a db file vs in-mem

// We're writing plain sql here as it doesn't matter for this exercise, but typically we'd use prepared statements
db.serialize(() => {
	db.run(`
		CREATE TABLE visitors (
			count INTEGER, 
			time TEXT
		)
	`);
});

function getCounts() {
	db.each(`SELECT * FROM visitors`, (err, row) => {
		try {
			console.log(row);
		} catch (error) {
			console.error(err);
		}
	});
}

function shutdownDB() {
	getCounts();
	console.log("Shutting down db");
	db.close();
}
