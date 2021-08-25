import Car from "./car.js";
export default class CarFromTop extends Car {
  constructor(game) {
    super(game);
    this.x = 390;
    this.y = -200;
    this.dx = 0;
    this.dy = 2;
    this.angle = 180;
    this.stopAt = 160;
    this.from = 'top';
    this.oppositeFrom = 'bottom';
  }

  inIntersection() {
    return this.y + this.height > this.stopAt;
  }

  stopBehindCarInFront() {
    if (this.carInFront?.turned || this.carInFront?.remove) return false;
    if (this.carInFront) {
      return this.y + this.height > this.carInFront.y - 20;
    }

    return false;
  }

  update() {
    if (this.stopBehindCarInFront() || this.broken) {
      return;
    }
    if (!(this.inIntersection() || this.to) || this.to == "forward") {
      this.y += this.dy;
    } else {
      if (this.to === "left") {
          this.x += this.turning?.dx || this.dx;
          this.y += this.turning?.dy || this.dy;
          if (this.y > 60 && !this.turned) {
            this.turned = true;
            this.turning = {
              angleChange: -0.5,
              xChange: 0.02,
              yChange: -0.002,
              angleEndAt: 90
            }
          }
          if (this.turning) {
            if (this.y > 240) {
              this.turning.yChange = -0.02;
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
        if (this.y > 60 && !this.turned) {
          this.turned = true;
          this.turning = {
            angleChange: 1,
            xChange: -0.04,
            yChange: -0.004,
            angleEndAt: 270,
          };
        }
        if (this.turning) {
          if (this.y > 150) {
            this.turning.yChange = -0.04;
          }
          this.angle += this.turning.angleChange;
          this.dx += this.turning.xChange;
          this.dy += this.turning.yChange;
          if (Math.abs(this.angle - this.turning.angleEndAt) < 0.02) {
            this.turning = null;
          }
        }
      }
      if (!this.to && this.game.verticalStatus !== "stop") {
        this.to = this.game.verticalStatus;
      }
    }
  }
}
