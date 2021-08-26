// Ionut: I think that we should update this so that we have examples for each hand, I don't think
// that this way it works if, for example, I want to have "stop" on one hand and "forward" on the
// other.
import Game from "../game/game.js";

export default class GestureClassifier {
  constructor() {
    this.gestureIds = [1, 2, 3, 4];
    this.currentProgress = null;
    this.signs = {
      1: {
        element: document.getElementById('stop'),
        progressBar: document.getElementById('stop-progress-bar')
      },
      2: {
        element: document.getElementById('left'),
        progressBar: document.getElementById('left-progress-bar')
      },
      3: {
        element: document.getElementById('right'),
        progressBar: document.getElementById('right-progress-bar')
      },
      4: {
        element: document.getElementById('forward'),
        progressBar: document.getElementById('forward-progress-bar')
      }
    }
    this.totalExamples = {};
    this.defaultExamples = 1;
  }

  init() {
    this.initializeEvents();
    this.initializeClassifier();
  }

  async initializeClassifier() {
    this.classifier = knnClassifier.create();
    this.mobilenet = await mobilenet.load();
  }

  addExample(image, log) {
    if (this.game) return;
    if (!this.trainingClass && this.defaultExamples > 50) return;

    const img = tf.browser.fromPixels(image);
    const example = this.mobilenet.infer(img, 'conv_preds');

    if (this.trainingClass) {
      this.classifier.addExample(example, this.trainingClass);
      // Update gesture button examples count
      const sign = document.getElementById(this.trainingClass);
      this.totalExamples[sign.id] ||= 0;
      this.totalExamples[sign.id]++;
      sign.dataset.examples++;
      this.move(this.currentProgress, sign.dataset.examples);
    } else {
      this.classifier.addExample(example, 'default');
      this.defaultExamples++;
    }

    img.dispose();

    this.checkIfReadyToProceed();
  }

  checkIfReadyToProceed() {
    const proceedBtn = document.getElementById('proceed-btn');
    if (!proceedBtn.classList.contains('display-none')) return;

    // TODO Update to 100 and uncomment the condition below
    const minExamplesToProceed = 20;
    if (
      // this.totalExamples.stop >= minExamplesToProceed &&
      // this.totalExamples.left >= minExamplesToProceed &&
      // this.totalExamples.right >= minExamplesToProceed &&
      // this.totalExamples.forward >= minExamplesToProceed
      true
    ) {
      proceedBtn.classList.remove('display-none');
      proceedBtn.addEventListener('click', () => {
        document.getElementById('app-container').classList.add('show-only-game');
        document.getElementById('gesture-learning-container').classList.add('show-only-video');
        this.game = new Game();
        this.game.start();
      });
    }
  }

  async predict(image, log) {
    if (!this.classifier.getNumClasses()) return;

    const img = tf.browser.fromPixels(image);
    const example = this.mobilenet.infer(img, 'conv_preds');
    const result = await this.classifier.predictClass(example);

    const { label, confidences } = result;
    log.isRightHand && (log.rightHandGesture = label);
    log.isLeftHand && (log.leftHandGesture = label);

    if (log.isLeftHand)
      document.getElementById('left-hand-gesture').innerHTML = label;
    if (log.rightHandGesture)
      document.getElementById('right-hand-gesture').innerHTML = label;

    if (confidences[label] === 1 && label !== 'default') {
      if (this.game) {
        if (log.isLeftHand)
          this.game.horizontalStatus = label;
        if (log.isRightHand)
          this.game.verticalStatus = label;
      }
      const sign = document.getElementById(label);
      if (!sign.classList.contains('predicted')) {
        sign.classList.add('predicted');
        sign.classList.add('animate');
      }
      setTimeout(() => {
        sign.classList.remove('predicted');
        sign.classList.remove('animate');
      }, 200);
    }

    img.dispose();
  }

  startTraining(sign, progressBar) {
    this.gestureIds.forEach((gestureId) => {
      const { element, progressBar } = this.signs[gestureId];
      this.stopTraining(element, progressBar);
    });

    sign.classList.add('training');
    this.trainingClass = sign.id;
    this.currentProgress = progressBar;
  }

  stopTraining(element, progressBar) {
    element.classList.remove('training');
    this.trainingClass = null;
    this.currentProgress = null;
  }

  toggleTraining(sign, progressBar) {
    if (sign.classList.contains('training')) {
      this.stopTraining(sign);
    } else {
      this.startTraining(sign, progressBar);
    }
  }

  initializeEvents() {
    this.gestureIds.forEach((gestureId) => {
      var elSign = this.signs[gestureId].element;
      var elProgressBar = this.signs[gestureId].progressBar;

      elSign.classList.add('sign-classifier-btn');
      elSign.dataset.examples = 0;
      elSign.addEventListener('click', () => {
        this.toggleTraining(elSign, elProgressBar);
      })
    })
  }

  move(bar, progressBarWidth) {
    if(progressBarWidth < 100)
      bar.style.width = progressBarWidth + "%";
  }
}
