import Entity from './Entity.js';
import Health from './Health.js';
import { TILE_SIZE, BASE_HP } from './initSettings.js';

export default class Base extends Entity {
    constructor(gridX, gridY, playerColor, playerId) {
        super(gridX, gridY, "BASE", playerId);
        this.type = "BASE";
        this.playerColor = playerColor;
        this.health = new Health(BASE_HP);
        this.initEventListener();
    }

    initEventListener() {
        this.health.on('zero', () => {
            this.emit("died");
        });
    }

    draw(ctx, spriteSheet) {
        super.draw(ctx, spriteSheet);
        ctx.fillStyle = this.playerColor;
        ctx.fillRect(this.gridX * TILE_SIZE, this.gridY * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE / 4);
        this.health.draw(ctx, this.x, this.y);
    }

    clone() {
        const clone = new Base(this.gridX, this.gridY, this.playerColor, this.playerId);
        clone.health = this.health.clone();
        clone.initEventListener();
        return clone
    }
}
