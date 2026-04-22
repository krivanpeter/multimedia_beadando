import EventEmitter from './EventEmitter.js';
import { TILE_SIZE, ASSETS_MAP } from './initSettings.js';

export default class Entity extends EventEmitter {
    constructor(id, x, y, assetKey, playerId) {
        super();
        this.id = id;
        this.x = x * TILE_SIZE;
        this.y = y * TILE_SIZE;
        this.asset = ASSETS_MAP[assetKey];
        this.playerId = playerId;
        this.isHighlighted = false;

        this.rotation = 0;
        this.flip = false;
        this.direction = null;
    }

    get gridX() { return Math.round(this.x / TILE_SIZE); }
    get gridY() { return Math.round(this.y / TILE_SIZE); }

    draw(ctx, spriteSheet) {
        if (!this.asset || !ctx || !spriteSheet) return;

        const cx = this.x + TILE_SIZE / 2;
        const cy = this.y + TILE_SIZE / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(this.rotation);

        ctx.scale(this.flip ? -1 : 1, 1)

        ctx.drawImage(
            spriteSheet,
            this.asset.x, this.asset.y, this.asset.w, this.asset.h,
            -TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);

        if (this.isHighlighted) {
            ctx.fillStyle = "rgba(43, 250, 205, 0.2)";
            ctx.fillRect(-TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
        }
        ctx.restore();
    }

    contains(mouseX, mouseY) {
        return (
            mouseX >= this.x && mouseX <= this.x + TILE_SIZE &&
            mouseY >= this.y && mouseY <= this.y + TILE_SIZE
        );
    }

    onClick() {

    }

    clone() {

    }
}