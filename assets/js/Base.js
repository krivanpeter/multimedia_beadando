import Entity from './Entity.js';
import { TILE_SIZE, BASE_HP } from './initSettings.js';

export default class Base extends Entity {
    constructor(id, gridX, gridY, playerColor, playerId) {
        super(id, gridX, gridY, "BASE", playerId);
        this.playerColor = playerColor;
        this.hp = BASE_HP;
    }

    draw(ctx, spriteSheet) {
        super.draw(ctx, spriteSheet);
        ctx.fillStyle = this.playerColor;
        ctx.fillRect(this.gridX * TILE_SIZE, this.gridY * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE / 4);
    }

    clone() {
        return new Base(this.id, this.gridX, this.gridY, this.playerColor);
    }

    onClick(){
        console.log("THE BASE IS CLICKED!");
    }
}
