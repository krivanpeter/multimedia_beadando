import EventEmitter from './EventEmitter.js';
import { TILE_SIZE, ASSETS_MAP } from './initSettings.js';

export default class Entity extends EventEmitter {
    constructor(id, x, y, assetKey, playerId) {
        super();
        this.id = id;
        this.gridX = x;
        this.gridY = y;
        this.x = x * TILE_SIZE;
        this.y = y * TILE_SIZE;
        this.asset = ASSETS_MAP[assetKey];
        this.playerId = playerId;
    }

    draw(ctx, spriteSheet) {
        if (!this.asset || !ctx || !spriteSheet) return;

        ctx.drawImage(
            spriteSheet,
            this.asset.x, this.asset.y, this.asset.w, this.asset.h,
            this.x, this.y, TILE_SIZE, TILE_SIZE
        );
    }

    contains(mouseX, mouseY) {
        return (
            mouseX >= this.x && mouseX <= this.x + TILE_SIZE &&
            mouseY >= this.y && mouseY <= this.y + TILE_SIZE
        );
    }
}