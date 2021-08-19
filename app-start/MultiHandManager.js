export class MultiHandManager {
    constructor() { }

    updateLandmarks(multiHandLandmarks) {
        this.multiHandLandmarks = multiHandLandmarks;
    }

    draw(ctx) {
        for (const landmarks of this.multiHandLandmarks) {
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS,
                { color: '#00FF00', lineWidth: 5 });
            drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 2 });
        }
    }
}