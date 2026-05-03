let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = false;
let gameMode = null;

let playerXName = "Player X";
let playerOName = "Player O";

/* ✅ Scores */
let scoreX = 0;
let scoreO = 0;
let drawCount = 0;

/* DOM */
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const resetBtn = document.getElementById("reset");

const scoreXText = document.getElementById("scoreX");
const scoreOText = document.getElementById("scoreO");
const drawsText = document.getElementById("draws");

const singleBtn = document.getElementById("singleBtn");
const multiBtn = document.getElementById("multiBtn");

/* Win patterns */
const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

/* Start modes */
singleBtn.onclick = () => {
  gameMode = "single";
  startGame();
};

multiBtn.onclick = () => {
  gameMode = "multi";
  startGame();
};

/* Start game */
function startGame() {
  board = ["","","","","","","","",""];
  currentPlayer = "X";
  gameActive = true;

  playerXName = document.getElementById("playerX").value || "Player X";
  playerOName = document.getElementById("playerO").value || "Player O";

  updateStatus();

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("win");
  });
}

/* Update status */
function updateStatus() {
  statusText.textContent =
    currentPlayer === "X"
      ? playerXName + "'s turn"
      : playerOName + "'s turn";
}

/* Click events */
cells.forEach(cell => {
  cell.addEventListener("click", () => {
    const index = cell.dataset.index;

    if (!gameActive || board[index] !== "") return;

    makeMove(index);

    if (gameMode === "single" && currentPlayer === "O" && gameActive) {
      setTimeout(computerMove, 400);
    }
  });
});

/* Make move */
function makeMove(index) {
  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;

  const win = checkWinner();

  if (win) {
    win.forEach(i => cells[i].classList.add("win"));

    if (currentPlayer === "X") scoreX++;
    else scoreO++;

    updateScore();

    statusText.textContent = currentPlayer + " wins!";
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    drawCount++;
    updateScore();

    statusText.textContent = "Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

/* Check winner */
function checkWinner() {
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return pattern;
    }
  }
  return null;
}

/* Computer */
function computerMove() {
  let move =
    findWinningMove("O") ||
    findWinningMove("X") ||
    getBestMove();

  makeMove(move);
}

function findWinningMove(player) {
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = player;
      if (checkWinner()) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }
  return null;
}

function getBestMove() {
  const priority = [4,0,2,6,8,1,3,5,7];
  return priority.find(i => board[i] === "");
}

/* Score update */
function updateScore() {
  scoreXText.textContent = "X: " + scoreX;
  scoreOText.textContent = "O: " + scoreO;
  drawsText.textContent = "Draws: " + drawCount;
}

/* Buttons */
restartBtn.onclick = startGame;

resetBtn.onclick = () => {
  scoreX = 0;
  scoreO = 0;
  drawCount = 0;
  updateScore();
  startGame();
};