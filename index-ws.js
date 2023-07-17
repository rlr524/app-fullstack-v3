const express = require("express");
const server = require("http").createServer();
const app = express();
const WebSocketServer = require("ws").Server;

app.get("/", (req, res) => {
	res.sendFile("/index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => {
	console.log("Listening on 3000");
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
