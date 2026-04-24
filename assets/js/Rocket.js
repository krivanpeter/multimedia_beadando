import { TILE_SIZE, ROCKET_SPEED } from "./initSettings.js";
import Entity from "./Entity.js";

export default class Rocket extends Entity {
    constructor(index, gridX, gridY, target, playerId) {
        super(gridX, gridY, "ROCKET", playerId);
        this.index = index;
        this.target = target;
        this.rotation = this.setRotation();
    }

    setRotation() {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        return Math.atan2(dy, dx);
    }

    update(dt) {
        const distX = this.target.x - this.x;
        const distY = this.target.y - this.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const moveStep = ROCKET_SPEED * dt * 100;

        if (distance > moveStep) {
            this.x += (distX / distance) * moveStep;
            this.y += (distY / distance) * moveStep;
        } else {
            this.emit("exploded", { index: this.index, target: this.target });
        }
    }
}