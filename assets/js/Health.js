import { HEALTH, TILE_SIZE } from './initSettings.js';

export default class Health {
    constructor(max) {
        this.max = max;
        this.current = max;
    }

    draw(ctx, x, y) {
        const barX = x + (TILE_SIZE / 2) - (HEALTH.WIDTH / 2);
        const barY = y - HEALTH.Y_OFFSET;
        this.drawHealthBar(ctx, barX, barY);
        this.drawHealthText(ctx, barX, barY);
    }

    drawHealthBar(ctx, x, y) {
        ctx.fillStyle = "rgb(4, 255, 0)";
        ctx.fillRect(x, y, HEALTH.WIDTH, HEALTH.HEIGHT);

        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, HEALTH.WIDTH, HEALTH.HEIGHT);
    }

    drawHealthText(ctx, x, y) {
        const centerX = x + (HEALTH.WIDTH / 2);
        const centerY = y + (HEALTH.HEIGHT / 2);

        ctx.font = "16px Arial";
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${this.current}/${this.max}`, centerX, centerY);
    }
}