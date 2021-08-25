import generateCar from "./car_generator.js";

export default class Game {
  constructor() {
    const canvasElement = document.getElementById("game-canvas");
    this.ctx = canvasElement.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.laneWidth = 250;
    this.canvas = {
      width: canvasElement.width,
      height: canvasElement.height,
    };
    this.horizontalStatus = "stop";
    this.verticalStatus = "stop";
    this.trafficLightsDx = {
      stop: 0,
      bottom: 20,
      left: 40,
      right: 60,
      top: 80,
    };
    this.cars = [];
    this.lastCarFrom = {};
  }

  start() {
    this.addEventListener();
    this.startCarGenerator();
    this.startLoop();
  }

  addEventListener() {
    [...document.querySelectorAll("input[type=radio][name=left-hand]")].forEach(
      (radio) => {
        radio.addEventListener("change", (e) => {
          this.horizontalStatus = e.target.value;
        });
      }
    );
    console.log(); // For some reasons it doesn't work if there's nothin between
    [
      ...document.querySelectorAll("input[type=radio][name=right-hand]"),
    ].forEach((radio) => {
      radio.addEventListener("change", (e) => {
        this.verticalStatus = e.target.value;
      });
    });
    document.getElementById('try-again-btn').addEventListener('click', () => {
      this.reset();
    })
  }

  startCarGenerator() {
    setInterval(() => {
      const car = generateCar(this);
      const lastCarFrom = this.lastCarFrom[car.from];
      if (lastCarFrom) {
        car.carInFront = lastCarFrom;
      }
      this.lastCarFrom[car.from] = car;
      this.cars.push(car);
    }, 2000);
  }

  startLoop() {
    this.loop();
  }

  loop() {
    if (this.stop) {
      document.getElementById('game-over-wrapper').classList.remove('display-none');
      this.drawCars();
      return;
    }
    this.drawMap();
    this.drawTrafficLights();
    this.removeCars();
    this.drawCars();
    window.requestAnimationFrame(this.loop.bind(this));
  }

  drawMap() {
    this.ctx.drawImage(document.getElementById("map-sprite"), 0, 0);
  }

  drawTrafficLights() {
    const sprite = document.getElementById("traffic-lights-sprite");

    switch (this.horizontalStatus) {
      case "stop":
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.stop,
          0,
          20,
          20,
          615,
          165,
          20,
          20
        );
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.stop,
          0,
          20,
          20,
          325,
          455,
          20,
          20
        );
        break;
      case "forward":
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.left,
          0,
          20,
          20,
          615,
          165,
          20,
          20
        );
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.right,
          0,
          20,
          20,
          325,
          455,
          20,
          20
        );
        break;
      case "left":
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.bottom,
          0,
          20,
          20,
          615,
          165,
          20,
          20
        );
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.top,
          0,
          20,
          20,
          325,
          455,
          20,
          20
        );
        break;
      case "right":
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.top,
          0,
          20,
          20,
          615,
          165,
          20,
          20
        );
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.bottom,
          0,
          20,
          20,
          325,
          455,
          20,
          20
        );
        break;
    }
    switch (this.verticalStatus) {
      case "stop":
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.stop,
          0,
          20,
          20,
          325,
          165,
          20,
          20
        );
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.stop,
          0,
          20,
          20,
          615,
          455,
          20,
          20
        );
        break;
      case "forward":
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.bottom,
          0,
          20,
          20,
          325,
          165,
          20,
          20
        );
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.top,
          0,
          20,
          20,
          615,
          455,
          20,
          20
        );
        break;
      case "left":
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.right,
          0,
          20,
          20,
          325,
          165,
          20,
          20
        );
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.left,
          0,
          20,
          20,
          615,
          455,
          20,
          20
        );
        break;
      case "right":
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.left,
          0,
          20,
          20,
          325,
          165,
          20,
          20
        );
        this.ctx.drawImage(
          sprite,
          this.trafficLightsDx.right,
          0,
          20,
          20,
          615,
          455,
          20,
          20
        );
        break;
    }
  }

  reset() {
    document.getElementById('game-over-wrapper').classList.add('display-none');
    this.horizontalStatus = "stop";
    this.verticalStatus = "stop";
    this.cars = [];
    this.stop = false;
    this.lastCarFrom = [];
    document.getElementById('default-left').checked = true;
    document.getElementById('default-right').checked = true;
    this.startLoop();
  }

  removeCars() {
    this.cars = this.cars.filter((car) => !car.remove);
  }

  drawCars() {
    this.cars.forEach((car) => car.draw(this));
  }
}
