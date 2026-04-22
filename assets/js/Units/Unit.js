import Entity from '../Entity.js';
import {
    TILE_SIZE,
    GAME_SPEED
} from '../initSettings.js';

export default class Unit extends Entity {
    constructor(id, gridX, gridY, assetKey, playerId, maxHp, cost, sounds) {
        super(id, gridX, gridY, assetKey, playerId);
        this.cost = cost;
        this.target = { gridX: gridX, gridY: gridY };
        this.state = "idle";
        this.clickable = true;
        this.maxHp = maxHp;
        this.currentHp = maxHp;

        this.facing = (playerId === 1) ? "right" : "left";
        this.moveDirection = null;
        this.setFacing();

        this.moveSound = new Audio(sounds.move);
        this.moveSound.loop = true;
        this.moveSound.volume = 1;
    }

    get targetXpx() { return this.target.gridX * TILE_SIZE; }
    get targetYpx() { return this.target.gridY * TILE_SIZE; }

    update(dt) {
        if (this.state === "idle") {
            this.stopMoveSound();
            return
        };

        this.playMoveSound();

        if (this.isAtTarget()) {
            this.handleArrival();
        } else {
            this.moveTowardsTarget(dt);
        }
    }

    setTarget(type, pos) {
        const targetPos = pos ? pos : type;
        if (!targetPos) return;

        this.target.gridX = targetPos.gridX;
        this.target.gridY = targetPos.gridY;

        this.state = "toTile";
    }

    isAtTarget() {
        const arriveEps = 2;
        return Math.abs(this.targetXpx - this.x) <= arriveEps && Math.abs(this.targetYpx - this.y) <= arriveEps;
    }

    moveTowardsTarget(dt) {
        const moveStep = GAME_SPEED * dt * 100;
        const dx = this.targetXpx - this.x;
        const dy = this.targetYpx - this.y;

        let newMoveDir = null;

        if (Math.abs(dx) > 0.1) {
            const step = Math.sign(dx) * Math.min(moveStep, Math.abs(dx));
            this.x += step;
            newMoveDir = step > 0 ? "right" : "left";
            this.facing = newMoveDir;
        } else if (Math.abs(dy) > 0.1) {
            const step = Math.sign(dy) * Math.min(moveStep, Math.abs(dy));
            this.y += step;
            newMoveDir = step > 0 ? "down" : "up";
        }
        if (newMoveDir && newMoveDir !== this.moveDirection) {
            this.moveDirection = newMoveDir;
            this.rotate();
        }
    }

    setFacing() {
        this.flip = (this.facing === "left");
    }

    rotate() {
        const facingLeft = this.facing === "left";
        switch (this.moveDirection) {
            case "up":
                this.rotation = (facingLeft ? 90 : 270) * Math.PI / 180;
                break;
            case "down":
                this.rotation = (facingLeft ? 270 : 90) * Math.PI / 180;
                break;
            case "left":
            case "right":
                this.rotation = 0;
                break;
        }
        this.setFacing();
    }


    handleArrival() {
        this.x = this.targetXpx;
        this.y = this.targetYpx;
        this.state = "idle";
    }

    onClick() {
        if (this.clickable) {
            this.isHighlighted = !this.isHighlighted;
        }
    }

    playMoveSound() {
        if (this.moveSound.paused) {
            this.moveSound.play();
        }
    }

    stopMoveSound() {
        this.moveSound.pause();
        this.moveSound.currentTime = 0;
    }

}