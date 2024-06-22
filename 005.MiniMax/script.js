// Initial game state setup
let currentPlayer = Math.random() < 0.5 ? "X" : "O";
let isGameOver = false;
const GameState = {
    X: -10,
    O: 10,
    Tie: 0
};

let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

// Check if the game is a tie
function checkTie() {
    return board.flat().every(cell => cell !== "");
}

// Check if a player has won
function checkWinner(player) {
    const diag1_check = board.every((row, i) => row[i] === player);
    const diag2_check = board.every((row, i) => row[2 - i] === player);

    // Check diagonals
    if (diag1_check || diag2_check) {
        return true;
    }

    // Check rows and columns
    for (let i = 0; i < 3; i++) {
        const rows_check = board[i].every(cell => cell === player);
        const cols_check = board.every(row => row[i] === player);
        if (rows_check || cols_check) {
            return true;
        }
    }
    return false;
}

// Check if the game has a winner or is a tie
function checkGameState() {
    if (checkWinner("X")) {
        return GameState.X;
    }
    if (checkWinner("O")) {
        return GameState.O;
    }
    if (checkTie()) {
        return GameState.Tie;
    }
    return null;
}

// Minimax algorithm implementation
function minimax(board, depth, isMaximizing) {
    let result = checkGameState();
    if (result !== null) {
        return result - depth;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    board[i][j] = "O";
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    board[i][j] = "X";
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

// Algorithm makes a move using the Minimax algorithm
function machinePlays() {
    let bestScore = currentPlayer === "O" ? -Infinity : Infinity;
    let bestMoves = [];
    let move;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] !== "") continue;
            board[i][j] = currentPlayer;
            let score = minimax(board, 0, currentPlayer == "O" ? false : true);
            board[i][j] = "";

            if ((currentPlayer === "O" && score > bestScore) || (currentPlayer === "X" && score < bestScore)) {
                bestScore = score;
                bestMoves = [{ i, j }];
            }else{
                bestMoves.push({ i, j });
            }
        }
    }

    if (bestMoves.length > 0) {
        move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }

    if (move) {
        board[move.i][move.j] = currentPlayer;
        document.querySelector(`.cell[data-value="${move.i * 3 + move.j + 1}"]`).textContent = currentPlayer;
        if (checkGameOver()) return;
        currentPlayer = currentPlayer === "O" ? "X" : "O";
    }
}

function checkGameOver() {
    if (checkWinner(currentPlayer) || checkTie()) {
        isGameOver = true;
    }
    return isGameOver;
}

// User makes a move by clicking a cell
document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", () => {
        if (cell.textContent === "" && !isGameOver) {
            let cellIndex = cell.dataset.value - 1;
            board[Math.floor(cellIndex / 3)][cellIndex % 3] = currentPlayer;
            cell.textContent = currentPlayer;
            if (checkGameOver()) return;
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            machinePlays();
        }
    });
});

if (currentPlayer === "O") {
    console.log("AI starts the game!");
    machinePlays();
}