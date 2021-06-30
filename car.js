export default class Car {
  constructor({ ctx, x, y, w, h, speed, road, stopAt, nextCar, direction, color}) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.road = road;
    this.stopAt = stopAt;
    this.nextCar = nextCar;
    this.direction = direction;
    this.color = color;
    this.visible = true;
  }

  checkCollision() {
    this.road.cars.forEach(car => {
      if (
        car.x > this.x && car.x < this.x + this.w &&
        car.y > this.y && car.y < this.y + this.h
      ) {
        car.speed = 0;
        car.color = 'red';
        this.speed = 0;
        this.color = 'red';
        this.road.onGameOver();
      }
    });
  }

  update() {
    this.checkCollision();
    switch (this.direction) {
      case 'right':
        if (this.nextCar && this.nextCar.x > 800) this.nextCar = null;
        if (this.nextCar && this.x + this.w + this.speed >= this.nextCar.x - 10) return;
        if (this.road.trafficRight || this.x + this.w > this.stopAt) {
          this.x += this.speed;
        } else if (this.x + this.w < this.stopAt) {
          this.x += this.speed;
        }
        if (this.x > 800) {
          this.visible = false;
          this.road.deleteCar();
        }
        break;
      case 'left':
        if (this.nextCar && this.nextCar.x < -70) this.nextCar = null;
        if (this.nextCar && this.x <= this.nextCar.x + this.nextCar.w + 10) return;
        if (this.road.trafficLeft || this.x < this.stopAt) {
          this.x += this.speed;
        } else if (this.x > this.stopAt) {
          this.x += this.speed;
        }
        if (this.x < -70) {
          this.visible = false;
          this.road.deleteCar();
        }
        break;
      case 'down':
        if (this.nextCar && this.nextCar.y > 800) this.nextCar = null;
        if (this.nextCar && this.y + this.h + this.speed >= this.nextCar.y - 10) return;
        if (this.road.trafficDown || this.y + this.h > this.stopAt) {
          this.y += this.speed;
        } else if (this.y + this.h < this.stopAt) {
          this.y += this.speed;
        }
        if (this.y > 800) {
          this.visible = false;
          this.road.deleteCar();
        }
        break;
      case 'up':
        if (this.nextCar && this.nextCar.y < -70) this.nextCar = null;
        if (this.nextCar && this.y <= this.nextCar.y + this.nextCar.h + 10) return;
        if (this.road.trafficUp || this.y < this.stopAt) {
          this.y += this.speed;
        } else if (this.y > this.stopAt) {
          this.y += this.speed;
        }
        if (this.y < -70) {
          this.visible = false;
          this.road.deleteCar();
        }
        break;
    }
  }

  draw() {
    this.ctx.save();
    this.update();
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
    this.ctx.restore();
  }
}
