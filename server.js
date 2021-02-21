const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

const hash = (txt) => crypto.createHash("sha256").update(txt).digest("hex");

app.use(express.static("public", { maxAge: 864000 }));

const gameBackend = require("./backend/socket.io-server");
var battleShipRoom = {};
gameBackend(io, battleShipRoom, "battleship");

app.get("*", (req, res) => res.redirect("/"));

server.listen(port);
