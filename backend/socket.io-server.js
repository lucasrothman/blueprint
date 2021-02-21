module.exports = (io, gameRoom, pathName) => {
  const crypto = require("crypto");
  const Battleship = require("./battleship").Battleship;

  const hash = (pwd) => crypto.createHash("sha256").update(pwd).digest("hex");

  io.of(`/${pathName}`).on("connection", (socket) => {
    socket.on("create-game", (msg) => {
      if (gameRoom[msg.room]) {
        return socket.emit("login-error", "Game already exists");
      }
      socket.join(msg.room, () => {
        gameRoom[msg.room] = {};
        gameRoom[msg.room].in = 1;
        gameRoom[msg.room].turns = 0;
        gameRoom[msg.room].login = hash(msg.login);
        gameRoom[msg.room].player1 = socket.id;

        socket.emit("game-created", "Game successfully created");
      });
    });
    socket.on("join-game", (msg) => {
      if (!gameRoom[msg.room] || gameRoom[msg.room].login != hash(msg.login)) {
        return socket.emit("login-error", "Invalid credentials to join game");
      }
      gameRoom[msg.room].in++;

      if (gameRoom[msg.room].in > 2) {
        socket.join(msg.room);
        return socket.emit("login-error", "Game full");
      }
      socket.join(msg.room);
      gameRoom[msg.room].player2 = socket.id;
      gameRoom[msg.room].game = Battleship();

      io.of(`/${pathName}`)
        .to(`${gameRoom[msg.room].player1}`)
        .emit("ready", `${gameRoom[msg.room].player2}`);
      io.of(`/${pathName}`)
        .to(`${gameRoom[msg.room].player2}`)
        .emit("ready", `${gameRoom[msg.room].player1}`);
    });
    socket.on("set-board", (msg) => {
      var success = gameRoom[msg.room].game.placeShips(msg.ships, msg.player);
      if (success) {
        socket.emit("setup-done");
      } else {
        socket.emit("setup-error");
      }
    });
    socket.on("move", (msg) => {
      if (!gameRoom[msg.room]) {
        return;
      }
      gameRoom[msg.room].game.attack(msg.position, msg.player == 1 ? 2 : 1);
      msg.player == gameRoom[msg.room].game.player;
      socket.to(msg.room).emit("move", msg);
      if (gameRoom[msg.room].game.gameOver) {
        socket.emit("game-over", gameRoom[msg.room].game.winner);
      }
    });
    socket.on("disconnecting", () => {
      var ingameRoom = socket.rooms;
      for (key in ingameRoom) {
        if (key !== socket.id) {
          if (gameRoom[key] && socket.id == gameRoom[key].player1) {
            io.of(`/${pathName}`).to(key).emit("player-disconnected", 2);
            delete gameRoom[key];
          } else if (gameRoom[key] && socket.id == gameRoom[key].player2) {
            io.of(`/${pathName}`).to(key).emit("player-disconnected", 1);
            delete gameRoom[key];
          }
        }
      }
    });
    socket.on("cancel-game", () => {
      for (key in socket.rooms) {
        if (key !== socket.id) {
          delete gameRoom[key];
        }
      }
    });
    socket.on("req-rematch", (room) => {
      socket.id == gameRoom[room].player1
        ? io
            .of(`/${pathName}`)
            .to(`${gameRoom[room].player2}`)
            .emit("req-rematch")
        : io
            .of(`/${pathName}`)
            .to(`${gameRoom[room].player1}`)
            .emit("req-rematch");
    });
    socket.on("rematch-accepted", (room) => {
      gameRoom[room].board = null;
      io.of(`/${pathName}`)
        .to(`${gameRoom[room].player1}`)
        .emit("ready", `${gameRoom[room].player2}`);
      io.of(`/${pathName}`)
        .to(`${gameRoom[room].player2}`)
        .emit("ready", `${gameRoom[room].player1}`);
    });
  });
  console.log(`socket.io listening for /${pathName}`);
};
