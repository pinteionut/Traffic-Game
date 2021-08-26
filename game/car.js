import detectCollision from "./sat_collision.js";

const CAR_SPRITES = [
  document.getElementById('taxi-sprite'),
  document.getElementById('viper-sprite'),
  document.getElementById('audi-sprite'),
  document.getElementById('minitruck-sprite'),
  document.getElementById('car-sprite'),
]

export default class Car {
  constructor(game) {
    this.width = 60;
    this.height = 125;
    this.sprite = CAR_SPRITES[Math.floor(Math.random() * CAR_SPRITES.length)]
    this.game = game;
  }

  happyFlowWith(car) {
    return this.from === car.from;
  }

  checkCollision() {
    if (!this.inIntersection()) return;
    this.game.cars.forEach((car) => {
      if (car.inIntersection() && !this.happyFlowWith(car) && detectCollision(this, car)) {
        this.stop = true;
        car.stop = true;
        this.game.stop = true;
        this.broken = true;
        car.broken = true;
      }
    });
  }

  draw() {
    this.checkCollision();
    this.update();
    if (this.outOfIntersection()) {
      this.remove = true;
    }
    const { ctx } = this.game;
    ctx.save();
    const horizontalCenter = this.x + this.width / 2;
    const verticalCenter = this.y + this.height / 2;
    ctx.translate(horizontalCenter, verticalCenter);
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.translate(horizontalCenter * -1, verticalCenter * -1);
    ctx.drawImage(this.sprite, this.x, this.y);
    if (this.broken) {
      ctx.drawImage(document.getElementById('boom-sprite'), this.x, this.y + 40);
    }
    ctx.restore();
  }

  outOfIntersection() {
    if (!this.inIntersection()) return false;
    return (
      (this.y < 0 - this.height) ||
      (this.y > this.game.canvas.height + 30) ||
      (this.x < 0 - this.height) ||
      (this.x > this.game.canvas.width + 30)
    )
  }
};
