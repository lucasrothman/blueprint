class Battleship {
  constructor(board = "start") {
    this.board = board === "start" ? this.init() : board;
    this.player = 1;
    this.winner = false;
    this.gameOver = false;
  }
  //Make 2 empty boards (player board and oponent board)
  init = () => {
    return {
      1: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      2: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    };
  };

  placeShips = (ships, player) => {
    for (let j = 0; j < ships.length; j++) {
      for (let i = 0; i < ships[j].length; i++) {
        this.board[player][ships[j][i][0]][ships[j][i][1]] = j + 1;
      }
    }
    if (this.checkValidBoard(player)) {
      console.log("Valid Board");
      return true;
    } else {
      console.log("Invalid Board");
      this.board[player] = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      return false;
    }
  };
  //Returns true if a position with one boat is adjacent to one with a different one
  checkNextPositionOtherShip = (pos, direction, player) => {
    try {
      if (
        this.board[player][pos[0]][pos[1]] !=
          this.board[player][pos[0] + direction[0]][pos[1] + direction[1]] &&
        this.board[player][pos[0] + direction[0]][pos[1] + direction[1]] != 0
      ) {
        return true;
      }
    } catch (e) {}

    return false;
  };

  checkAdjacentShip = (pos, player) => {
    if (this.checkNextPositionOtherShip(pos, [0, 1], player)) {
      return true;
    } else if (this.checkNextPositionOtherShip(pos, [1, 0], player)) {
      return true;
    } else if (this.checkNextPositionOtherShip(pos, [0, -1], player)) {
      return true;
    } else if (this.checkNextPositionOtherShip(pos, [-1, 0], player)) {
      return true;
    }
    return false;
  };

  checkValidBoard = (player) => {
    for (let i = 0; i < this.board[player].length - 1; i++) {
      for (let j = 0; j < this.board[player].length - 1; j++) {
        if (this.board[player][i][j] != 0) {
          if (this.checkAdjacentShip([i, j], player)) {
            return false;
          }
        }
      }
    }
    return true;
  };

  checkGameOver = () => {
    p1 = 0;
    p2 = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.board[1][i][j] != 0) {
          p1++;
        }
      }
    }
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.board[2][i][j] != 0) {
          p2++;
        }
      }
    }
    if (p1 == 0) {
      this.winner = 2;
      this.gameOver = true;
      return true;
    } else if (p2 == 0) {
      this.gameOver = true;
      this.winner = 1;
      return true;
    }
    return false;
  };

  attack = (position, targetPlayer) => {
    if (this.board[targetPlayer][position[0]][position[1]] != 0) {
      this.board[targetPlayer][position[0]][position[1]] = 0;
      this.checkGameOver();
      return true;
    }
    this.player = this.player == 1 ? 2 : 1;
    return false;
  };
}

// var a = new Battleship();
// a.placeShips(
//   [
//     [
//       [0, 0],
//       [0, 1],
//       [0, 2],
//     ],
//     [
//       [1, 1],
//       [1, 2],
//       [1, 3],
//       [1, 4],
//     ],
//   ],
//   1
// );
