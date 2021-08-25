import Car from './car.js';

export default class CarFromBottom extends Car {
  constructor(game) {
    super(game);
    this.x = 520;
    this.y = 840;
    this.dx = 0;
    this.dy = -2;
    this.angle = 0;
    this.stopAt = 480;
    this.from = 'bottom';
    this.oppositeFrom = 'top';
  }

  inIntersection() {
    return this.y < this.stopAt;
  }

  stopBehindCarInFront() {
    if (this.carInFront?.turned || this.carInFront?.remove) return false;
    if (this.carInFront) {
      return this.y < this.carInFront.y + this.carInFront.height + 20;
    }

    return false;
  }

  update() {
    if (this.stopBehindCarInFront() || this.broken) {
      return;
    }
    if (!(this.inIntersection() || this.to) || this.to == "forward") {
      this.y += this.dy;
      if (this.y < 0 - this.height) {
        this.remove = true;
      }
    } else {
      if (this.to === "left") {
          this.x += this.turning?.dx || this.dx;
          this.y += this.turning?.dy || this.dy;
          if (this.y < 465 && !this.turned) {
            this.turned = true;
            this.turning = {
              angleChange: -0.5,
              xChange: -0.02,
              yChange: 0.002,
              angleEndAt: -90
            }
          }
          if (this.turning) {
            if (this.y < 280) {
              this.turning.yChange = 0.02;
            }
            this.angle += this.turning.angleChange;
            this.dx += this.turning.xChange;
            this.dy += this.turning.yChange;
            if (Math.abs(this.angle - this.turning.angleEndAt) < 0.01) {
              this.turning = null;
            }
          }
          if (this.x < 0 - this.height) {
            this.remove = true;
          }
      }
      if (this.to === "right") {
        this.x += this.turning?.dx || this.dx;
        this.y += this.turning?.dy || this.dy;
        if (this.y < 465 && !this.turned) {
          this.turned = true;
          this.turning = {
            angleChange: 1,
            xChange: 0.04,
            yChange: 0.004,
            angleEndAt: 90,
          };
        }
        if (this.turning) {
          if (this.y < 375) {
            this.turning.yChange = 0.04;
          }
          this.angle += this.turning.angleChange;
          this.dx += this.turning.xChange;
          this.dy += this.turning.yChange;
          if (Math.abs(this.angle - this.turning.angleEndAt) < 0.02) {
            this.turning = null;
          }
        }
        if (this.x > this.game.canvas.width + 30) {
          this.remove = true;
        }
      }
      if (!this.to && this.game.verticalStatus !== "stop") {
        this.to = this.game.verticalStatus;
      }
    }
  }
}
