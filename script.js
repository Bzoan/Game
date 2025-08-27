// --- Configuration ---
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 20;

const BALL_SIZE = 14;
const BALL_SPEED = 6;
const AI_SPEED = 4;

let playerY = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let aiY = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let ballX = CANVAS_WIDTH / 2 - BALL_SIZE / 2;
let ballY = CANVAS_HEIGHT / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);
let playerScore = 0;
let aiScore = 0;

// --- Mouse Control ---
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  if (playerY < 0) playerY = 0;
  if (playerY > CANVAS_HEIGHT - PADDLE_HEIGHT) playerY = CANVAS_HEIGHT - PADDLE_HEIGHT;
});

// --- Main Game Loop ---
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

// --- Update Logic ---
function update() {
  // Move ball
  ballX += ballVX;
  ballY += ballVY;

  // Top & bottom wall collision
  if (ballY < 0) {
    ballY = 0;
    ballVY *= -1;
  } else if (ballY + BALL_SIZE > CANVAS_HEIGHT) {
    ballY = CANVAS_HEIGHT - BALL_SIZE;
    ballVY *= -1;
  }

  // Paddle collision - Player
  if (
    ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
    ballX >= PADDLE_MARGIN &&
    ballY + BALL_SIZE >= playerY &&
    ballY <= playerY + PADDLE_HEIGHT
  ) {
    ballX = PADDLE_MARGIN + PADDLE_WIDTH;
    ballVX *= -1;
    // Add some "spin"
    let impact = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
    ballVY = impact * 0.25;
  }

  // Paddle collision - AI
  if (
    ballX + BALL_SIZE >= CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
    ballX + BALL_SIZE <= CANVAS_WIDTH - PADDLE_MARGIN &&
    ballY + BALL_SIZE >= aiY &&
    ballY <= aiY + PADDLE_HEIGHT
  ) {
    ballX = CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
    ballVX *= -1;
    // Add some "spin"
    let impact = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
    ballVY = impact * 0.25;
  }

  // Score Check
  if (ballX < 0) {
    aiScore++;
    resetBall(-1);
  }
  if (ballX > CANVAS_WIDTH) {
    playerScore++;
    resetBall(1);
  }

  // --- Basic AI ---
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
    aiY += AI_SPEED;
  } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
    aiY -= AI_SPEED;
  }
  if (aiY < 0) aiY = 0;
  if (aiY > CANVAS_HEIGHT - PADDLE_HEIGHT) aiY = CANVAS_HEIGHT - PADDLE_HEIGHT;
}

// --- Drawing ---
function draw() {
  // Clear
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Center line
  ctx.strokeStyle = "#555";
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2, 0);
  ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Player paddle
  ctx.fillStyle = "#0ff";
  ctx.fillRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // AI paddle
  ctx.fillStyle = "#f0f";
  ctx.fillRect(CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Ball
  ctx.fillStyle = "#fff";
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

  // Scores
  ctx.font = "36px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(playerScore, CANVAS_WIDTH / 2 - 60, 50);
  ctx.fillText(aiScore, CANVAS_WIDTH / 2 + 60, 50);
}

// --- Reset Ball ---
function resetBall(direction) {
  ballX = CANVAS_WIDTH / 2 - BALL_SIZE / 2;
  ballY = CANVAS_HEIGHT / 2 - BALL_SIZE / 2;
  ballVX = BALL_SPEED * direction;
  ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}