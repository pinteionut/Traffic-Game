import CarFromBottom from "./car_from_bottom.js";
import CarFromLeft from "./car_from_left.js";
import CarFromRight from './car_from_right.js';
import CarFromTop from "./car_from_top.js";

export default function generateCar(game) {
  switch(Math.floor(Math.random() * 4)) {
    case 0: return new CarFromLeft(game);
    case 1: return new CarFromTop(game);
    case 2: return new CarFromRight(game);
    case 3: return new CarFromBottom(game);
  }
};
