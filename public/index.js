$(() => {
  var board = new Board();
  var game;
  var player;
  var initialColor;
  var socket = window.io("/battleship");
  var passwordField = $("#password");
  var gamenameField = $("#gamename");
  var rematchBtnDiv = $(".rematch-req-div");
  var rematchBtn = $(".rematch-btn");
  var room;
  var playing = false;
  var shipsPlaced = false;
  passwordField.val("");
  gamenameField.val("");
  var opponentConnected = false;
  var opponentReqRematch = false;
  passwordField.val("");
  gamenameField.val("");
  const initialStateInit = () => {
    board = null;
    game = null;
    playing = false;
    player = initialColor;
    rematchBtn.val("Rematch");
    rematchBtn.attr("disabled", false);
    rematchBtnDiv.hide();
    opponentConnected = false;
    opponentReqRematch = false;
    passwordField.val("");
    gamenameField.val("");
    boardhtml.empty();
  };

  window.createGame = () => {
    if (passwordField.val() && gamenameField.val()) {
      $("#join").attr("disabled", true);
      $("#create").attr("disabled", true);
      passwordField.attr("disabled", true);
      gamenameField.attr("disabled", true);
      room = gamenameField.val();
      $("#indicator").text("Waiting");
      const msg = {
        room: room,
        login: passwordField.val(),
      };
      player = 1;
      initialPlayer = player;
      passwordField.val("");
      gamenameField.val("");
      return socket.emit("create-game", msg);
    }
    $("#indicator").text("Error, a game must have a name and passcode");
    return false;
  };

  window.joinGame = () => {
    if (passwordField.val() && gamenameField.val()) {
      room = gamenameField.val();
      $("#indicator").text("Joining Game");
      const msg = {
        roomId: room,
        login: passwordField.val(),
      };
      player = 2;
      initialPlayer = player;
      return socket.emit("join-game", msg);
    }
    $("#indicator").text("Error, a game must have a name and passcode");
    return false;
  };

  window.cancel = () => {
    socket.emit("cancel-game");
    $("#join").attr("disabled", false);
    $("#create").attr("disabled", false);
    passwordField.attr("disabled", false);
    gamenameField.attr("disabled", false);
    room = "";
    $("#indicator").text("");
    $("#cancel").hide();
  };
  window.reqRematch = () => {
    if (!opponentReqRematch) {
      socket.emit("req-rematch", room);
      rematchBtn.val("Rematch Requested");
      rematchBtn.attr("disabled", true);
    } else {
      socket.emit("rematch-accepted", room);
    }
  };

  socket.on("ready", (playerId) => {
    initialStateInit();
    $(".currentTurn").show();
    $("#sep").text(" || ");
    opponentReqRematch = false;
    playing = true;
    opponentConnected = true;
    $("#indicator").text("Game Ready");
    $(".setup").hide();
    initGame();
    $(".player").text(`You are ${player}`);
    $(".gameStatus").show();
    $(".currentTurn").text(game.player[0] == "1" ? "P1's Turn" : "P2's Turn");
  });

  socket.on("move", (msg) => {
    board.move(msg.move);
    gameOver();
    $(".currentTurn").text(game.player[0] == "1" ? "P1's Turn" : "P2's Turn");
  });

  socket.on("login-error", (msg) => {
    $("#join").attr("disabled", false);
    $("#create").attr("disabled", false);
    passwordField.attr("disabled", false);
    gamenameField.attr("disabled", false);
    $("#indicator").text("Error: " + msg);
  });

  socket.on("game-created", (msg) => {
    $("#cancel").show();
    $("#indicator").html(msg + "<br />" + "Waiting for opponent...");
  });

  socket.on("req-rematch", () => {
    opponentReqRematch = true;
    rematchBtn.val("Rematch ✓");
  });

  socket.on("player-disconnected", (winner) => {
    player = "gameover";
    clearInterval(connectionInterval);
    if (playing) {
      $(".player").text(`${winner === 1 ? "P1" : "P2"} wins by resignation`);
      $(".sep").text("");
      $(".currentTurn").remove();
    } else {
      rematchBtn.val("Rematch");
      rematchBtn.attr("disabled", true);
    }
    playing = false;
    opponentConnected = false;
    socket.disconnect();
  });

  socket.on("game-over", (msg) => {
    rematchBtnDiv.show();
    player = "gameover";
    playing = false;
    clearInterval(connectionInterval);
    var winMsg;
    if (msg.winner === 1) {
      winMsg = "P1 Wins";
    } else if (msg.winner === 2) {
      winMsg = "P2 Wins";
    }
    $(".player").text(`${winMsg}`);
    $("#sep").text("");
    $(".currentTurn").text("");
    board.endGame();
  });

  //   var connectionInterval = setInterval(() => {
  //     if (!socket.connected) gameTimout();
  //   }, 1000);

  const gameTimeout = () => {
    if (playing == false) {
      location.reload();
    }
    clearInterval(connectionInterval);
    $(".player").text(`You timed out`);
    player = "gameover";
    $("#sep").text("");
    $(".currentTurn").text("");
  };

  const gameOver = () => {
    var over = game.gameOver();

    if (over) {
      if (over == "1") {
        socket.emit("game-over", { score: [1, 0], room: room });
      } else if (over == "2") {
        socket.emit("game-over", { score: [0, 1], room: room });
      } else {
        socket.emit("game-over", { score: [0, 0], room: room });
      }
      clearInterval(connectionInterval);
      player = "gameover";
      board.endGame();
      return true;
    }
    return false;
  };
});
