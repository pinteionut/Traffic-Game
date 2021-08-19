export default class LeftHand {
    constructor() {}

    updateLandmarks(landmarks) {
      this.landmarks = landmarks;
    }

    draw(ctx) {
      drawConnectors(
        ctx,
        this.landmarks,
        HAND_CONNECTIONS,
        { color: '#00FF00', lineWidth: 5 }
      );
      drawLandmarks(ctx, this.landmarks, {
        color: "green",
        lineWidth: 1,
      });
    }
  }