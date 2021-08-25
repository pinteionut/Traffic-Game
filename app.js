import HandDetection from './gesture_classifier/hand_detection.js';

export default class App {
  init() {
    this.initializeMediaPipe();
  }

  initializeMediaPipe() {
    const handDetection = new HandDetection();
    handDetection.init();
  }
}
