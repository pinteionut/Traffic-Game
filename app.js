import CONFIG from "./config.js";
import Road from "./road.js";

let gameOver = false;

const onGameOver = () => {
  gameOver = true;
  document.getElementById('status').innerText = "GAME OVER ( refresh to start again)";
}


const ctx = document.getElementById('canvas').getContext('2d');

const { width: canvasWidth, height: canvasHeight } = CONFIG.canvas;

const road = new Road(ctx, onGameOver);

function draw() {
  if (gameOver) return;
  ctx.save();
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = 'lightgreen';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.restore();
  road.draw();
  road.cars.forEach((car) => car.draw());
  document.getElementById('number-of-cars').innerText = `CARS: ${road.cars.length}`;
  document.getElementById('score').innerText = `SCORE: ${road.score}`;
  window.requestAnimationFrame(draw);
}

draw();

document.getElementById('traffic-light-right').addEventListener('click', () => {
  road.trafficRight = !road.trafficRight;
});

document.getElementById('traffic-light-left').addEventListener('click', () => {
  road.trafficLeft = !road.trafficLeft;
});

document.getElementById('traffic-light-down').addEventListener('click', () => {
  road.trafficDown = !road.trafficDown;
});

document.getElementById('traffic-light-up').addEventListener('click', () => {
  road.trafficUp = !road.trafficUp;
});

setInterval(() => {
  if (road.cars.length >= 100) return;
  road.addCar(
    ['right', 'left', 'down', 'up'][Math.floor(Math.random() * 4)],
    ['purple', 'blue', 'yellow', 'pink'][Math.floor(Math.random() * 5)])
}, 2000);
