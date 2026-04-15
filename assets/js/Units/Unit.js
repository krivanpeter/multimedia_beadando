import Entity from '../Entity.js';
import {
    TILE_SIZE
} from '../initSettings.js';

export default class Unit extends Entity {
    constructor(id, gridX, gridY, assetKey, playerId, maxHp, speed) {
        super(id, gridX, gridY, assetKey, playerId);
        this.speed = speed;
        this.target = { gridX: gridX, gridY: gridY };
        this.state = "idle";
        this.clickable = true;
    }

    get targetXpx() { return this.target.gridX * TILE_SIZE; }
    get targetYpx() { return this.target.gridY * TILE_SIZE; }

    update(dt) {
        if (this.state === "idle") return;

        if (this.isAtTarget()) {
            this.handleArrival();
        } else {
            this.moveTowardsTarget(dt);
        }
    }

    setTarget(pos) {
        if (!pos) return;
        this.target.gridX = pos.gridX;
        this.target.gridY = pos.gridY;
    }

    isAtTarget() {
        const arriveEps = 2;
        return Math.abs(this.targetXpx - this.x) <= arriveEps &&
                Math.abs(this.targetYpx - this.y) <= arriveEps;
    }

    moveTowardsTarget(dt) {
        const moveStep = this.speed * dt * 100;
        const dx = this.targetXpx - this.x;
        const dy = this.targetYpx - this.y;

        if (Math.abs(dx) > 0.1) {
            this.x += Math.sign(dx) * Math.min(moveStep, Math.abs(dx));
        } else if (Math.abs(dy) > 0.1) {
            this.y += Math.sign(dy) * Math.min(moveStep, Math.abs(dy));
        }
    }

    handleArrival() {
        this.x = this.targetXpx;
        this.y = this.targetYpx;

        if (this.state === "toTile") {
            this.state = "idle";
        }
    }

    onClick() {
        if (this.clickable) {
            this.isHighlighted = !this.isHighlighted;
        }
    }

    get targetXpx() { return this.target.gridX * TILE_SIZE; }
    get targetYpx() { return this.target.gridY * TILE_SIZE; }
}