let cells;
let maze_created = false;
let won = false;
let answer_stack = [];
let answer_found = false;
let cheatcodes = [];
const cheatkeys = ["m", "i", "n", "h", "o"];
let cheatTimeout;
let isCheatCodeActivated = false;

const rows = 15;
const cols = 15;
const visited = new Set();
const tooltip = document.getElementById("tooltip");
const w = document.querySelector("#w");
const s = document.querySelector("#s");
const a = document.querySelector("#a");
const d = document.querySelector("#d");

function getRandomUnVisitedNeighbour(current) {
    const neighbors = [];

    const row = Math.floor(current / cols);
    const col = current % cols;

    if (row > 0) {
        neighbors.push(current - cols);
    }

    if (row < rows - 1) {
        neighbors.push(current + cols);
    }

    if (col > 0) {
        neighbors.push(current - 1);
    }

    if (col < cols - 1) {
        neighbors.push(current + 1);
    }

    const unvisited = neighbors.filter(neighbour => !visited.has(neighbour));
    if (unvisited.length === 0) {
        return null;
    }
    const randomNeighbour = unvisited[Math.floor(Math.random() * unvisited.length)];
    return randomNeighbour;
}

function removeWall(current, next) {
    /*
   Explanation of the following code:
   If the direction is 1, it means that the random neighbour is to the right of the current cell
   If the direction is -1, it means that the random neighbour is to the left of the current cell
   If the direction is cols, it means that the random neighbour is below the current cell
   If the direction is -cols, it means that the random neighbour is above the current cell
   */
    const direction = next - current;
    if (direction === -cols) {
        cells[current].style.borderTop = "none";
        cells[next].style.borderBottom = "none";
    }
    if (direction === cols) {
        cells[current].style.borderBottom = "none";
        cells[next].style.borderTop = "none";
    }
    if (direction === -1) {
        cells[current].style.borderLeft = "none";
        cells[next].style.borderRight = "none";
    }
    if (direction === 1) {
        cells[current].style.borderRight = "none";
        cells[next].style.borderLeft = "none";
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dfs(maze, start) {
    const stack = [start];
    answer_stack = [start];
    while (stack.length > 0) {
        const current = stack.pop();
        if (current === rows * cols - 1) {
            answer_found = true;
        } else if (!answer_found) {
            answer_stack.pop();
        }
        maze.children[current].classList.add("current-gen");
        visited.add(current);
        const next = getRandomUnVisitedNeighbour(current);
        if (next) {
            removeWall(current, next);
            stack.push(current);
            stack.push(next);
            if (!answer_found) {
                answer_stack.push(current);
                answer_stack.push(next);
            }
        }
        await sleep(10);
        maze.children[current].classList.remove("current-gen");
    }
    maze.children[start].classList.add("current");
    maze_created = true;
    tooltip.innerHTML = "Use W A S D or arrow keys to move";
}

function lightUpButtons(btn) {
    switch (btn) {
        case "w":
            w.classList.add("lit");
            setTimeout(() => { w.classList.remove("lit"); }, 100);
            break;
        case "s":
            s.classList.add("lit");
            setTimeout(() => { s.classList.remove("lit"); }, 100);
            break;
        case "a":
            a.classList.add("lit");
            setTimeout(() => { a.classList.remove("lit"); }, 100);
            break;
        case "d":
            d.classList.add("lit");
            setTimeout(() => { d.classList.remove("lit"); }, 100);
            break;
    }
}

function movement(maze, movement) {
    if (won) {
        return;
    }
    const current = document.querySelector(".current");
    const index = Array.from(maze.children).indexOf(current);
    if (movement === "UP" && current.style.borderTop === "none") {
        maze.children[index].classList.remove("current");
        maze.children[index - cols].classList.add("current");
    }
    if (movement === "DOWN" && current.style.borderBottom === "none") {
        maze.children[index].classList.remove("current");
        maze.children[index + cols].classList.add("current");
    }
    if (movement === "LEFT" && current.style.borderLeft === "none") {
        maze.children[index].classList.remove("current");
        maze.children[index - 1].classList.add("current");
    }
    if (movement === "RIGHT" && current.style.borderRight === "none") {
        maze.children[index].classList.remove("current");
        maze.children[index + 1].classList.add("current");
    }
    if (document.querySelector(".current").classList.contains("final")) {
        document.querySelector(".current").classList.add("won");
        won = true;
        tooltip.innerHTML = "You won! Press F5 to play again";
    }
}


document.addEventListener("DOMContentLoaded", async function () {
    tooltip.innerHTML = "Generating maze..."
    const maze = document.querySelector("#maze")
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell_element = document.createElement("div");
            cell_element.classList.add("cell");
            maze.appendChild(cell_element);
        }
    }

    const initial_position = 0;
    const final_position = rows * cols - 1;

    cells = document.querySelectorAll(".cell");
    await dfs(maze, initial_position);
    cells[final_position].classList.add("final");
    document.querySelector(".controls").style.visibility = "visible";

    document.addEventListener("keydown", function (event) {
        if (!maze_created || won || isCheatCodeActivated) {
            return;
        }
        if (event.key === "w" || event.key === "W" || event.key === "ArrowUp") {
            movement(maze, "UP");
            lightUpButtons("w");
        }
        if (event.key === "s" || event.key === "S" || event.key === "ArrowDown") {
            movement(maze, "DOWN");
            lightUpButtons("s");
        }
        if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
            movement(maze, "LEFT");
            lightUpButtons("a");
        }
        if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
            movement(maze, "RIGHT");
            lightUpButtons("d");
        }
        // f5 key
        if (event.key === "F5") {
            window.location.reload();
        }

        // cheatcode 

        if (cheatkeys.includes(event.key.toLowerCase())) {
            cheatcodes.push(event.key.toLowerCase());
            clearTimeout(cheatTimeout);
            cheatTimeout = setTimeout(() => {
                cheatcodes = [];
            }, 3000);

            if (cheatcodes.length == 5) {
                let cheatcode = cheatcodes.join("");
                if (cheatcode === "minho") {
                    isCheatCodeActivated = true;
                    moveAccordingToTheAnswerStack();
                    tooltip.textContent = `Cheat code activated!`;
                }
                cheatcodes = [];
            }
        } else {
            cheatcodes = [];
        }
    });

    w.onclick = () => {
        movement(maze, "UP");
        lightUpButtons("w");
    }

    s.onclick = () => {
        movement(maze, "DOWN");
        lightUpButtons("s");
    }

    a.onclick = () => {
        movement(maze, "LEFT");
        lightUpButtons("a");
    }

    d.onclick = () => {
        movement(maze, "RIGHT");
        lightUpButtons("d");
    }

});


async function moveAccordingToTheAnswerStack() {
    if (answer_stack.length === 0) {
        return;
    }
    const maze = document.querySelector("#maze");
    while (answer_stack.length > 0) {
        let current = document.querySelector(".current");
        current.style.backgroundColor = "rgba(255, 215, 0, 0.7)";
        let index = Array.from(maze.children).indexOf(current);
        let next = answer_stack.shift();
        if (next === index - cols) {
            movement(maze, "UP");
        }
        if (next === index + cols) {
            movement(maze, "DOWN");
        }
        if (next === index - 1) {
            movement(maze, "LEFT");
        }
        if (next === index + 1) {
            movement(maze, "RIGHT");
        }
        await sleep(50);
    }
}
