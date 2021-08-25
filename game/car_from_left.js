import Car from "./car.js";
export default class CarFromLeft extends Car {
  constructor(game) {
    super(game);
    this.x = -200;
    this.y = 320;
    this.dx = 2;
    this.dy = 0;
    this.angle = 90;
    this.stopAt = 350;
    this.from = 'left';
    this.oppositeFrom = 'right';
  }

  inIntersection() {
    return this.x + this.height > this.stopAt;
  }

  stopBehindCarInFront() {
    if (this.carInFront?.turned || this.carInFront?.remove) return false;
    if (this.carInFront) {
      return this.x + this.height > this.carInFront.x - 20;
    }

    return false;
  }

  update() {
    if (this.stopBehindCarInFront() || this.broken) {
      return;
    }
    if (!(this.inIntersection() || this.to) || this.to == "forward") {
      this.x += this.dx;
    } else {
      if (this.to === "left") {
        this.x += this.turning?.dx || this.dx;
        this.y += this.turning?.dy || this.dy;
        if (this.x > 250 && !this.turned) {
          this.turned = true;
          this.turning = {
            angleChange: -0.5,
            xChange: -0.002,
            yChange: -0.02,
            angleEndAt: 0
          };
        }
        if (this.turning) {
          if (this.x > 430) {
            this.turning.xChange = -0.02;
          }
          this.angle += this.turning.angleChange;
          this.dx += this.turning.xChange;
          this.dy += this.turning.yChange;
          if (Math.abs(this.angle - this.turning.angleEndAt) < 0.01) {
            this.turning = null;
          }
        }
      }
      if (this.to === "right") {
        this.x += this.turning?.dx || this.dx;
        this.y += this.turning?.dy || this.dy;
        if (this.x > 250 && !this.turned) {
          this.turned = true;
          this.turning = {
            angleChange: 1,
            xChange: -0.004,
            yChange: 0.04,
            angleEndAt: 180
          };
        }
        if (this.turning) {
          if (this.x > 340) {
            this.turning.xChange = -0.04;
          }
          this.angle += this.turning.angleChange;
          this.dx += this.turning.xChange;
          this.dy += this.turning.yChange;
          if (Math.abs(this.angle - this.turning.angleEndAt) < 0.02) {
            this.turning = null;
          }
        }
      }
      if (!this.to && this.game.horizontalStatus !== "stop") {
        this.to = this.game.horizontalStatus;
      }
    }
  }
}
