const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRID_SIZE = 20;
const GRID_WIDTH = canvas.width / GRID_SIZE;
const GRID_HEIGHT = canvas.height / GRID_SIZE;

let snake = {
    body: [{ x: GRID_WIDTH / 2, y: GRID_HEIGHT / 2 }],
    direction: { x: 0, y: 0 },
    grow: false
};

let food = {
    x: 0,
    y: 0
};

let lastMoveTime = 0;
const MOVE_INTERVAL = 150; // Adjust this value to change the snake's speed

let paused = false;

function randomPosition() {
    return Math.floor(Math.random() * GRID_WIDTH);
}

function updateFoodPosition() {
    food.x = randomPosition();
    food.y = randomPosition();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "#0f0";
    snake.body.forEach(segment => {
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    });

    // Draw food
    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

function move() {
    const now = Date.now();
    if (now - lastMoveTime >= MOVE_INTERVAL) {
        lastMoveTime = now;

        const head = { x: snake.body[0].x + snake.direction.x, y: snake.body[0].y + snake.direction.y };
        snake.body.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            snake.grow = true;
            updateFoodPosition();
        }

        if (!snake.grow) {
            snake.body.pop();
        } else {
            snake.grow = false;
        }
    }
}

function checkCollision() {
    const head = snake.body[0];
    if (
        head.x < 0 || head.x >= GRID_WIDTH ||
        head.y < 0 || head.y >= GRID_HEIGHT ||
        snake.body.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        return true;
    }
    return false;
}

function handleKeyPress(event) {
    const key = event.keyCode;
    if (!paused) {
        if (key === 37) { // Left arrow
            snake.direction = { x: -1, y: 0 };
        } else if (key === 38) { // Up arrow
            snake.direction = { x: 0, y: -1 };
        } else if (key === 39) { // Right arrow
            snake.direction = { x: 1, y: 0 };
        } else if (key === 40) { // Down arrow
            snake.direction = { x: 0, y: 1 };
        } else if (key === 32) { // Space bar
            paused = true;
        }
    } else {
        if (key === 32) { // Space bar
            paused = false;
            lastMoveTime = Date.now();
            requestAnimationFrame(gameLoop);
        }
    }
}

document.addEventListener("keydown", handleKeyPress);

function gameLoop() {
    if (!paused) {
        move();
        draw();
        if (checkCollision()) {
            alert("Game Over!");
            snake = {
                body: [{ x: GRID_WIDTH / 2, y: GRID_HEIGHT / 2 }],
                direction: { x: 0, y: 0 },
                grow: false
            };
            updateFoodPosition();
        }
    }
    requestAnimationFrame(gameLoop);
}

updateFoodPosition();
gameLoop();
