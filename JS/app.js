const canvas = document.getElementById('game');
const playingField = canvas.getContext('2d');

const box = 20;
let snake = [];
let food = {};
let direction = 'RIGHT';
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timer = 0;
let gameInterval, timerInterval;
let speed = 100;

const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const highScoreDisplay = document.getElementById("highScore");
function initGame(difficulty = "medium") {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = 'RIGHT';
    score = 0;
    timer = 0;
  
    switch(difficulty) {
      case "easy": speed = 150; break;
      case "hard": speed = 70; break;
      default: speed = 100; break;
    }
  
    scoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;
    timerDisplay.textContent = timer;
  
    placeFood();
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timer++;
      timerDisplay.textContent = timer;
    }, 1000);
    gameInterval = setInterval(draw, speed);
  }
  
  function placeFood() {
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box
    };
  }
  
  function draw() {
    playingField.fillStyle = "#e0e0e0";
    playingField.fillRect(0, 0, canvas.width, canvas.height);
  
    for (let i = 0; i < snake.length; i++) {
      playingField.fillStyle = i === 0 ? "green" : "darkgreen";
      playingField.fillRect(snake[i].x, snake[i].y, box, box);
    }
  
    playingField.fillStyle = "red";
    playingField.fillRect(food.x, food.y, box, box);
  
    let headX = snake[0].x;
    let headY = snake[0].y;
  
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
  
    if (
      headX < 0 || headX >= canvas.width ||
      headY < 0 || headY >= canvas.height ||
      collision(headX, headY, snake)
    ) {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      gameOverSound.play();
      alert("Game Over!");
      return;
    }
  
    let newHead = { x: headX, y: headY };
  
    if (headX === food.x && headY === food.y) {
      score += 10;
      eatSound.play();
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
      }
      scoreDisplay.textContent = score;
      highScoreDisplay.textContent = highScore;
      placeFood();
    } else {
      snake.pop();
    }
  
    snake.unshift(newHead);
  }
  
  function collision(x, y, array) {
    for (let i = 0; i < array.length; i++) {
      if (x === array[i].x && y === array[i].y) {
        return true;
      }
    }
    return false;
  }
  
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  });
  
  document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
  
  document.getElementById("playButton").addEventListener("click", () => {
    const difficulty = document.getElementById("difficulty").value;
    initGame(difficulty);
  });