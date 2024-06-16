let cells;
let maze_created = false;
let won = false;

const rows = 15;
const cols = 15;
const visited = new Set();
const tooltip = document.getElementById("tooltip");


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

async function dfs(maze,start) {
    const stack = [start];
    while (stack.length > 0){
        const current = stack.pop();
        maze.children[current].classList.add("current-gen");
        visited.add(current);        
        const next = getRandomUnVisitedNeighbour(current);
        if (next) {
            removeWall(current, next);
            stack.push(current);
            stack.push(next);
        }
        await sleep(10);
        maze.children[current].classList.remove("current-gen");
    }
    maze.children[start].classList.add("current");
    maze_created = true;
    tooltip.innerHTML = "Use W A S D or arrow keys to move";
}


function movement(maze,movement){
    const current = document.querySelector(".current");
    const index = Array.from(maze.children).indexOf(current);
    if(movement === "UP" && current.style.borderTop === "none"){
        maze.children[index].classList.remove("current");
        maze.children[index-cols].classList.add("current");
    }
    if(movement === "DOWN" && current.style.borderBottom === "none"){
        maze.children[index].classList.remove("current");
        maze.children[index+cols].classList.add("current");
    }
    if(movement === "LEFT" && current.style.borderLeft === "none"){
        maze.children[index].classList.remove("current");
        maze.children[index-1].classList.add("current");
    }
    if(movement === "RIGHT" && current.style.borderRight === "none"){
        maze.children[index].classList.remove("current");
        maze.children[index+1].classList.add("current");
    }
    if(document.querySelector(".current").classList.contains("final")){
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
    await dfs(maze,initial_position);
    cells[final_position].classList.add("final");

    document.addEventListener("keydown", function (event) {
        if(!maze_created || won){
            return;
        }
        if(event.key ==="w" || event.key === "W" || event.key === "ArrowUp"){
            movement(maze,"UP");
        }
        if(event.key ==="s" || event.key === "S" || event.key === "ArrowDown"){
            movement(maze,"DOWN");
        }
        if(event.key ==="a" || event.key === "A" || event.key === "ArrowLeft"){
            movement(maze,"LEFT");
        }
        if(event.key ==="d" || event.key === "D" || event.key === "ArrowRight"){
            movement(maze,"RIGHT");
        }
        // f5 key
        if(event.key === "F5"){
            window.location.reload();
        }
    });
    
});