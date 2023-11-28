let paddle;
let ball;
let bricks = [];
let rows = 5;
let cols = 10;
let lives = 3;
let gameStarted = false;

function setup() {
  createCanvas(800, 600);
  paddle = new Paddle();
  ball = new Ball();

  createBricks();
}

function draw() {
  background(0);

  displayLives();

  paddle.display();
  paddle.move();

  if (!gameStarted) {
    ball.placeOnPaddle(paddle);
  } else {
    ball.move();
  }
  ball.display();
  ball.checkPaddleCollision(paddle);
  if (ball.checkWallCollision()) {
    lives--;
    if (lives <= 0) {
      displayMessage("Game Over");
      noLoop(); // Stop the game loop
      setTimeout(resetGame, 3000); // Reset the game after 3 seconds
      return;
    }
    resetBallOnPaddle();
  }

  for (let i = bricks.length - 1; i >= 0; i--) {
    bricks[i].display();
    if (ball.checkBrickCollision(bricks[i])) {
      bricks.splice(i, 1);
    }
  }
  if (bricks.length === 0) {
    for (let i = bricks.length - 1; i >= 0; i--) {
      bricks[i].display();
    }
    displayMessage("Victory!");
    noLoop(); // Stop the game loop
    setTimeout(resetGame, 5000); // Reset the game after 5 seconds
    return;
  }
}

function mousePressed() {
  if (!gameStarted) {
    gameStarted = true;
    ball.startMoving();
  }
}

function resetGame() {
  // Reset game variables
  lives = 3;
  gameStarted = false;
  createBricks();
  resetBallOnPaddle();
  loop(); // Restart the game loop
}

function createBricks() {
  bricks = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      bricks.push(new Brick(j * 80 + 10, i * 30 + 10));
    }
  }
}

function resetBallOnPaddle() {
  gameStarted = false;
  ball.resetBall();
}

function displayLives() {
  fill(255);
  textSize(16);
  text('Lives: ' + lives, 10, height - 10);
}

function displayMessage(message) {
  textSize(32);
  textAlign(CENTER, CENTER);
  text(message, width / 2, height / 2);
}

// Paddle, Ball, and Brick classes remain unchanged


// Paddle class
class Paddle {
  constructor() {
    this.width = 100;
    this.height = 20;
    this.x = width / 2 - this.width / 2;
    this.y = height - this.height - 10;
  }

  display() {
    rect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.x = mouseX - this.width / 2;

    // Constrain the paddle within the canvas
    this.x = constrain(this.x, 0, width - this.width);
  }
}

// Ball class
class Ball {
  constructor() {
    this.resetBall();
  }

  display() {
    ellipse(this.x, this.y, this.size);
  }

  placeOnPaddle(paddle) {
    this.x = paddle.x + paddle.width / 2;
    this.y = paddle.y - this.size;
  }

  startMoving() {
    this.speedX = 5;
    this.speedY = -5;
  }

  move() {
    if (gameStarted) {
      this.x += this.speedX;
      this.y += this.speedY;
    }
  }

  resetBall() {
    this.x = width / 2;
    this.y = height / 2;
    this.size = 15;
    this.speedX = 0;
    this.speedY = 0;
  }

  checkPaddleCollision(paddle) {
    if (this.x > paddle.x && this.x < paddle.x + paddle.width && 
        this.y + this.size > paddle.y && this.y < paddle.y + paddle.height) {
      // Untangle the ball from the paddle
      this.y = paddle.y - this.size;

      // Reverse direction
      this.speedY *= -1;
    }
  }

  checkWallCollision() {
    if (this.x <= 0 || this.x >= width) {
      this.speedX *= -1;
    }
    if (this.y <= 0) {
      this.speedY *= -1;
    }
    if (this.y >= height) {
      // Ball hit the bottom bar, return true
      return true;
    }
    return false;
  }

  checkBrickCollision(brick) {
    if (this.x + this.size > brick.x && this.x - this.size < brick.x + brick.width && 
        this.y + this.size > brick.y && this.y - this.size < brick.y + brick.height) {
      this.speedY *= -1;
      return true;
    }
    return false;
  }
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 20;
    this.cornerRadius = 7;
  }

  display() {
    rect(this.x, this.y, this.width, this.height, this.cornerRadius);
  }
}
