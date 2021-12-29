/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let gameId = 0;
const games = [];

class Game {
  constructor(height, width, player1, player2, gameId) {
    this.height = height;
    this.width = width;
    this.board = [];
    this.gameId = gameId;
    this.player1 = player1;
    this.player2 = player2;
    this.currPlayer = player1;
    this.gameEnded = false
  }

  /** makeBoard: create in-JS board structure:
   *    board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() {
    for (let w = 0; w < this.width; w++) {
      this.board[w] = [];
      for (let h = 0; h < this.height; h++) {
        this.board[w][h] = null;
      }
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const htmlBoard = document.querySelector("#board");

    // The following will create the first row of the table which the user click to add their peiece to the table

    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    htmlBoard.append(top);

    // This will create the rest of the table where the pieces will be added to.

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}-${this.gameId}`);
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let i = this.height - 1; i >= 0; i--) {
      if (this.board[x][i] === null) return i;
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const div = document.createElement("div");
    div.classList.add("piece");
    div.style.backgroundColor = this.currPlayer.color;
    const cell = document.getElementById(`${y}-${x}-${this.gameId}`);
    cell.append(div);
  }

  /** endGame: announce game end */

  endGame(msg) {
    this.gameEnded= true
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    if(this.gameEnded) return
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table

    this.board[x][y] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.name} won!`);
    }

    // check for tie
    if (y==this.height) {
    if (this.board.every((row) => row.every((cell) => cell !== null)))
      this.endGame("TIE!");
    }

    // switch players

    this.currPlayer === this.player1
      ? (this.currPlayer = this.player2)
      : (this.currPlayer = this.player1);
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }
    const _winBind = _win.bind(this);

    // This will loop to all cells and check if the next 3 cells in diagonal, ver, or horiz cells have the same players.
    // If so, it will return true.

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        if (
          _winBind(horiz) ||
          _winBind(vert) ||
          _winBind(diagDR) ||
          _winBind(diagDL)
        ) {
          return true;
        }
      }
    }
  }

  startGame() {
    this.makeBoard();
    this.makeHtmlBoard();
  }

  resetGame() {
    this.currPlayer = this.player1;
    this.makeBoard();
    const pieces = document.querySelectorAll(".piece");
    pieces.forEach((piece) => piece.remove());
  }
}

class Player {
  constructor(color, name) {
    console.log(color);
    this.color = color
    this.name = Boolean(name) ? name : this.color;
  }
}

const addGameButton = document.querySelector("#add");
const resetGameButton = document.querySelector("#reset");



addGameButton.addEventListener("click", () => {
  const player1Name = document.querySelector("#player1-name").value;
const player2Name = document.querySelector("#player2-name").value;

const player1Color = document.querySelector("#player1-color").value
const color1 = player1Color? player1Color : "red"

const player2Color = document.querySelector("#player2-color").value;
const color2 = player2Color? player2Color : "blue"

  const player1 = new Player(color1, player1Name);
  const player2 = new Player(color2, player2Name);
  const game = new Game(6, 7, player1, player2, gameId);
  games.push(game);
  game.startGame();
  gameId++;
});

resetGameButton.addEventListener("click", () => {
  games.forEach((game) => game.resetGame());
});
