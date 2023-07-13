const http = require("http");

http.createServer(function (req, res) {
	res.write("Getting started on fs app...");
	res.end();
}).listen(3000);

console.log("Server started on port 3000");
