import Car from "./car.js";

export default class Road {
  constructor(ctx, onGameOver) {
    this.ctx = ctx;
    this.cars = [];
    this.trafficRight = 0;
    this.trafficLeft = 0;
    this.trafficDown = 0;
    this.trafficUp = 0;
    this.score = 0;
    this.onGameOver = onGameOver;
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, 300, 800, 200);
    this.ctx.fillRect(300, 0, 200, 800);
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 395, 300, 10);
    this.ctx.fillRect(500, 395, 300, 10);
    this.ctx.fillRect(395, 0, 10, 300);
    this.ctx.fillRect(395, 500, 10, 300);
    this.ctx.fillStyle = this.trafficRight ? 'green' : 'red';
    this.ctx.beginPath();
    this.ctx.arc(280, 500, 10, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.fillStyle = this.trafficLeft ? 'green' : 'red';
    this.ctx.beginPath();
    this.ctx.arc(520, 300, 10, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.fillStyle = this.trafficDown ? 'green' : 'red';
    this.ctx.beginPath();
    this.ctx.arc(300, 280, 10, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.fillStyle = this.trafficUp ? 'green' : 'red';
    this.ctx.beginPath();
    this.ctx.arc(500, 520, 10, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.restore();
  }

  addCar(direction, color) {
    let car;
    if (direction === 'right') {
      car = new Car({
        ctx: this.ctx,
        x: -70,
        y: 425,
        w: 70,
        h: 55,
        speed: 2,
        road: this,
        stopAt: 290,
        direction: 'right',
        nextCar: this.cars.filter((car) => car.direction === 'right')[0],
        color: color
      });
    }
    if (direction === 'left') {
      car = new Car({
        ctx: this.ctx,
        x: 870,
        y: 320,
        w: 70,
        h: 55,
        speed: -2,
        road: this,
        stopAt: 510,
        direction: 'left',
        nextCar: this.cars.filter((car) => car.direction === 'left')[0],
        color: color
      });
    }
    if (direction === 'down') {
      car = new Car({
        ctx: this.ctx,
        x: 320,
        y: -70,
        w: 55,
        h: 70,
        speed: 2,
        road: this,
        stopAt: 290,
        direction: 'down',
        nextCar: this.cars.filter((car) => car.direction === 'down')[0],
        color: color
      });
    }
    if (direction === 'up') {
      car = new Car({
        ctx: this.ctx,
        x: 425,
        y: 870,
        w: 55,
        h: 70,
        speed: -2,
        road: this,
        stopAt: 510,
        direction: 'up',
        nextCar: this.cars.filter((car) => car.direction === 'up')[0],
        color: color
      });
    }
    this.cars.unshift(car);
  }

  deleteCar() {
    this.cars = this.cars.filter((car) => car.visible);
    this.score++;
  }
}
