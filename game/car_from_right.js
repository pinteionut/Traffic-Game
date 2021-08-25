import Car from "./car.js";
export default class CarFromRight extends Car {
  constructor(game) {
    super(game);
    this.x = 1160;
    this.y = 190;
    this.dx = -2;
    this.dy = 0;
    this.angle = 270;
    this.stopAt = 550;
    this.from = 'right';
    this.oppositeFrom = 'left';
  }

  inIntersection() {
    return this.x - this.height < this.stopAt;
  }

  stopBehindCarInFront() {
    if (this.carInFront?.turned || this.carInFront?.remove) return false;
    if (this.carInFront) {
      return this.x < this.carInFront.x + this.carInFront.height + 20;
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
          if (this.x < 650 && !this.turned) {
            this.turned = true;
            this.turning = {
              angleChange: -0.5,
              xChange: 0.002,
              yChange: 0.02,
              angleEndAt: 180,
              completeDx: 0,
              completeDy: 2
            }
          }
          if (this.turning) {
            if (this.x < 470) {
              this.turning.xChange = 0.02;
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
        if (this.x < 650 && !this.turned) {
          this.turned = true;
          this.turning = {
            angleChange: 1,
            xChange: 0.004,
            yChange: -0.04,
            angleEndAt: 360,
          };
        }
        if (this.turning) {
          if (this.x < 560) {
            this.turning.xChange = 0.04;
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
