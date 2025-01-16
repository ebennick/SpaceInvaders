const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('scoreValue');

    const playerWidth = 30;
    const playerHeight = 20;
    const playerSpeed = 5;
    let playerX = canvas.width / 2 - playerWidth / 2;
    const playerY = canvas.height - playerHeight - 10;

    const bulletWidth = 3;
    const bulletHeight = 10;
    const bulletSpeed = 7;
    const bullets = [];

    const invaderWidth = 25;
    const invaderHeight = 20;
    const invaderRows = 4;
    const invaderCols = 10;
    const invaderSpeedX = 1;
    const invaderSpeedY = 15;
    let invaders = [];
    let invaderDirection = 1;

    let score = 0;
    let gameRunning = true;

    function createInvaders() {
      invaders = [];
      for (let row = 0; row < invaderRows; row++) {
        for (let col = 0; col < invaderCols; col++) {
          invaders.push({
            x: col * (invaderWidth + 10) + 50,
            y: row * (invaderHeight + 10) + 30,
            alive: true,
          });
        }
      }
    }

    function drawPlayer() {
      ctx.fillStyle = '#00f';
      ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
    }

    function drawBullets() {
      ctx.fillStyle = '#ff0';
      bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
      });
    }

    function drawInvaders() {
      ctx.fillStyle = '#0f0';
      invaders.forEach(invader => {
        if (invader.alive) {
          ctx.fillRect(invader.x, invader.y, invaderWidth, invaderHeight);
        }
      });
    }

    function updatePlayer() {
      if (keys['ArrowLeft'] && playerX > 0) {
        playerX -= playerSpeed;
      }
      if (keys['ArrowRight'] && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
      }
    }

    function updateBullets() {
      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bulletSpeed;
        if (bullets[i].y < 0) {
          bullets.splice(i, 1);
        }
      }
    }

    function updateInvaders() {
      let moveDown = false;
      for (const invader of invaders) {
        if (invader.alive) {
          invader.x += invaderSpeedX * invaderDirection;
          if (invader.x > canvas.width - invaderWidth || invader.x < 0) {
            moveDown = true;
          }
        }
      }

      if (moveDown) {
        invaderDirection *= -1;
        for (const invader of invaders) {
          if (invader.alive) {
            invader.y += invaderSpeedY;
          }
        }
      }
    }

    function checkCollisions() {
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (const invader of invaders) {
          if (invader.alive &&
              bullet.x < invader.x + invaderWidth &&
              bullet.x + bulletWidth > invader.x &&
              bullet.y < invader.y + invaderHeight &&
              bullet.y + bulletHeight > invader.y) {
            invader.alive = false;
            bullets.splice(i, 1);
            score += 10;
            scoreDisplay.textContent = score;
            break;
          }
        }
      }

      for (const invader of invaders) {
        if (invader.alive && invader.y + invaderHeight > playerY) {
          gameRunning = false;
          alert('Game Over!');
          break;
        }
      }
    }

    function checkWin() {
      if (invaders.every(invader => !invader.alive)) {
        gameRunning = false;
        alert('You Win!');
      }
    }

    function gameLoop() {
      if (!gameRunning) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      updatePlayer();
      updateBullets();
      updateInvaders();
      checkCollisions();
      checkWin();

      drawPlayer();
      drawBullets();
      drawInvaders();

      requestAnimationFrame(gameLoop);
    }

    const keys = {};
    document.addEventListener('keydown', (e) => {
      keys[e.code] = true;
      if (e.code === 'Space') {
        bullets.push({ x: playerX + playerWidth / 2 - bulletWidth / 2, y: playerY });
      }
    });
    document.addEventListener('keyup', (e) => {
      keys[e.code] = false;
    });

    createInvaders();
    gameLoop();
