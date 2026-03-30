import Unit from './Unit.js';
import { WORKER_HP, WORKER_SPEED, ROCK_MINING_AMOUNT, IRON_MINING_AMOUNT, URANIUM_MINING_AMOUNT } from '../initSettings.js';

export default class WorkerUnit extends Unit {
    constructor(id, gridX, gridY, playerId, base) {
        const assetKey = (playerId === 1) ? "WORKER_BLUE" : "WORKER_GREEN";
        super(id, gridX, gridY, assetKey, playerId, WORKER_HP, WORKER_SPEED);

        this.base = base;
        this.target = { gridX: null, gridY: null };
        this.resource = { gridX: null, gridY: null, type: null };
        this.hasTarget = false;
        this.isReturning = false;
    }

    setTarget(res) {
        this.resource.gridX = res.gridX + this.getOffsetForResource();
        this.resource.gridY = res.gridY + this.getOffsetForResource();
        this.resource.type = res.type;

        this.target.gridX = this.resource.gridX;
        this.target.gridY = this.resource.gridY;

        this.isReturning = false;
        this.hasTarget = true;
    }

    update(dt) {
        if (!this.hasTarget) return;

        const distX = this.target.x - this.x;
        const distY = this.target.y - this.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const moveStep = this.speed * dt * 100;

        if (distance > moveStep) {
            this.x += (distX / distance) * moveStep;
            this.y += (distY / distance) * moveStep;
        } else {
            this.x = this.target.x;
            this.y = this.target.y;

            if (!this.isReturning) {
                this.isReturning = true;
                this.target.x = this.base.x;
                this.target.y = this.base.y;
                console.log(this.resource.type + " begyűjtve");
            } 
        }
    }

    getOffsetForResource(){
        return (this.playerId === 1) ? -1 : 1;
    }

    getResourceAmount() {
        switch (this.resource.type) {
            case "rock":
                return ROCK_MINING_AMOUNT
            case "iron":
                return IRON_MINING_AMOUNT
            case "uranium":
                return URANIUM_MINING_AMOUNT
        }
    }

    onClick() {
        console.log("I'm clicked:", this);
        this.clicked = true;
    }
}