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
    if (!this.trainingClass && this.defaultExamples > 50) return;

    const img = tf.browser.fromPixels(image);
    const example = this.mobilenet.infer(img, 'conv_preds');

    if (this.trainingClass) {
      this.classifier.addExample(example, this.trainingClass);
      // Update gesture button examples count
      const sign = document.getElementById(this.trainingClass);
      sign.dataset.examples++;
      this.move(this.currentProgress, sign.dataset.examples);

    } else {
      this.classifier.addExample(example, 'default');
      this.defaultExamples++;
    }

    img.dispose();
  }

  async predict(image, log) {
    if (!this.classifier.getNumClasses()) return;
    const img = tf.browser.fromPixels(image);
    const example = this.mobilenet.infer(img, 'conv_preds');
    const result = await this.classifier.predictClass(example);

    const { label, confidences } = result;
    log.isRightHand && (log.rightHandGesture = label);
    log.isLeftHand && (log.leftHandGesture = label);

    //console.log(label, confidences[label]);
    console.log( "[Left hand]: " + log.isLeftHand + " [LeftHandGesture]: " + log.leftHandGesture);
    if (confidences[label] === 1 && label !== 'default') {
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

  move(bar, proogresBarWidth) {
    if(proogresBarWidth < 100)
      bar.style.width = proogresBarWidth + "%";
  }
}