import LeftHand from "./left_hand.js";
import RightHand from "./right_hand.js";

import GestureClassifier from "./gesture_classifier.js";

const log = {
    isRightHand: false,
    isLeftHand: false,
    leftHandGesture: 'none',
    rightHandGesture: 'none'
}

export default class HandDetection {
    constructor() { }

    init() {
        this.initializeElements();
        this.initializeHolistic();
        this.initializeCamera();
        this.leftHand = new LeftHand();
        this.rightHand = new RightHand();
        this.gestureClassifier = new GestureClassifier();
        this.gestureClassifier.init();
    }

    initializeElements() {
        this.videoElement = document.getElementById("videoInput");
        this.canvasElement = document.getElementById("handDetection");
        this.canvasCtx = this.canvasElement.getContext("2d");
    }

    initializeHolistic() {
        this.holistic = new Holistic({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
            }
        });

        this.holistic.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        this.holistic.onResults(this.onResults.bind(this));
    }

    initializeCamera() {
        const camera = new Camera(this.videoElement, {
            onFrame: async () => {
                await this.holistic.send({ image: this.videoElement });
            },
            width: 780,
            height: 439,
        });
        camera.start();
    }

    onResults(results) {
        this.canvasCtx.save();
        this.canvasCtx.clearRect(
            0,
            0,
            this.canvasElement.width,
            this.canvasElement.height
        );
        this.canvasCtx.drawImage(
            results.image,
            0,
            0,
            this.canvasElement.width,
            this.canvasElement.height
        );

        log.isLeftHand = !!results.leftHandLandmarks;
        log.isRightHand = !!results.rightHandLandmarks;

        if (results.leftHandLandmarks) {
            this.leftHand.updateLandmarks(results.leftHandLandmarks);
            this.leftHand.draw(this.canvasCtx);

            this.gestureClassifier.addExample(results.image, log);
            this.gestureClassifier.predict(results.image, log);
        }

        if (results.rightHandLandmarks) {
            this.rightHand.updateLandmarks(results.rightHandLandmarks);
            this.rightHand.draw(this.canvasCtx);

            this.gestureClassifier.addExample(results.image, log);
            this.gestureClassifier.predict(results.image, log);
        }
        this.canvasCtx.restore();
    }
}
