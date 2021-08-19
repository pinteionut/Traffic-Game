import HandDetection from './handDetection.js';

export default class App {
  init() {
    this.initializeMediaPipe();
  }

  initializeMediaPipe() {
    const handDetection = new HandDetection();
    handDetection.init();
  }
}