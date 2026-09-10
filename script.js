const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isAnimating = false;
let animationId;

let rainDrops = [];
let rainbowAlpha = 0;

// Создание капель дождя
function createRain() {
  rainDrops = [];

  for (let i = 0; i < 120; i++) {
    rainDrops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: 10 + Math.random() * 15,
      speed: 3 + Math.random() * 4
    });
  }
}

// Рисуем фон
function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#6ca6cd");
  sky.addColorStop(1, "#b0e0e6");

  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Земля
  ctx.fillStyle = "#3cb371";
  ctx.fillRect(0, 390, canvas.width, 110);
}

// Рисуем облака
function drawCloud(x, y) {
  ctx.fillStyle = "white";

  ctx.beginPath();
  ctx.arc(x, y, 30, 0, Math.PI * 2);
  ctx.arc(x + 35, y - 10, 35, 0, Math.PI * 2);
  ctx.arc(x + 75, y, 30, 0, Math.PI * 2);
  ctx.arc(x + 35, y + 15, 30, 0, Math.PI * 2);
  ctx.fill();
}

// Рисуем дождь
function drawRain() {
  ctx.strokeStyle = "#1e90ff";
  ctx.lineWidth = 2;

  for (let drop of rainDrops) {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x - 3, drop.y + drop.length);
    ctx.stroke();
  }
}

// Обновляем положение капель
function updateRain() {
  for (let drop of rainDrops) {
    drop.y += drop.speed;

    if (drop.y > canvas.height) {
      drop.y = -20;
      drop.x = Math.random() * canvas.width;
    }
  }
}

// Рисуем радугу
function drawRainbow() {
  ctx.save();

  ctx.globalAlpha = rainbowAlpha;
  ctx.lineWidth = 18;

  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet"
  ];

  for (let i = 0; i < colors.length; i++) {
    ctx.beginPath();
    ctx.strokeStyle = colors[i];

    ctx.arc(
      canvas.width / 2,
      390,
      190 - i * 18,
      Math.PI,
      0
    );

    ctx.stroke();
  }

  ctx.restore();
}

// Рисуем солнце
function drawSun() {
  ctx.fillStyle = "#ffd700";
  ctx.beginPath();
  ctx.arc(680, 80, 45, 0, Math.PI * 2);
  ctx.fill();
}

// Основная функция рисования
function drawScene() {
  drawBackground();

  drawSun();

  drawCloud(120, 90);
  drawCloud(300, 70);
  drawCloud(520, 100);

  if (isAnimating) {
    drawRain();
    drawRainbow();
  }
}

// Анимация
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateRain();

  if (rainbowAlpha < 1) {
    rainbowAlpha += 0.005;
  }

  drawScene();

  animationId = requestAnimationFrame(animate);
}

// Запуск анимации
function startAnimation() {
  if (!isAnimating) {
    isAnimating = true;
    rainbowAlpha = 0;
    createRain();
    animate();
  }
}

// Остановка анимации
function stopAnimation() {
  isAnimating = false;
  cancelAnimationFrame(animationId);
  drawScene();
}

// Проверка клика по центру холста
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const distance = Math.sqrt(
    Math.pow(mouseX - centerX, 2) +
    Math.pow(mouseY - centerY, 2)
  );

  if (distance < 100) {
    startAnimation();
  }
});

// Двойной щелчок останавливает
canvas.addEventListener("dblclick", function () {
  stopAnimation();
});

// Первоначальная отрисовка
drawScene();