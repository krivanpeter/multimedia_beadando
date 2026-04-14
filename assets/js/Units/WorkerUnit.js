import Unit from './Unit.js';
import {
    WORKER_HP,
    WORKER_SPEED,
    ROCK_MINING_AMOUNT,
    IRON_MINING_AMOUNT,
    URANIUM_MINING_AMOUNT,
    TILE_SIZE
} from '../initSettings.js';

export default class WorkerUnit extends Unit {
    constructor(id, gridX, gridY, playerId, base) {
        const assetKey = (playerId === 1) ? "WORKER_BLUE" : "WORKER_GREEN";
        super(id, gridX, gridY, assetKey, playerId, WORKER_HP, WORKER_SPEED);

        this.base = base;
        this.startX = gridX;
        this.startY = gridY;
        this.target = { gridX: null, gridY: null };
        this.resource = { gridX: null, gridY: null, type: null };

        this.state = "idle";
    }

    setTarget(res) {
        this.resource.gridX = res.gridX;
        this.resource.gridY = res.gridY;
        this.resource.type = res.type;

        this.target.gridX = res.gridX;
        this.target.gridY = res.gridY;

        this.state = "toResource";
    }

    get targetXpx() { return this.target.gridX * TILE_SIZE; }
    get targetYpx() { return this.target.gridY * TILE_SIZE; }

    update(dt) {
        if (this.state === "idle") {
            this.clickable = true;
            return;
        }

        if (this.isAtTarget()) {
            this.handleArrival();
        } else {
            this.moveTowardsTarget(dt);
        }

    }

    isAtTarget() {
        const arriveEps = 2;

        return Math.abs(this.targetXpx - this.x) <= arriveEps &&
            Math.abs(this.targetYpx - this.y) <= arriveEps;
    }

    handleArrival() {
        this.x = this.targetXpx;
        this.y = this.targetYpx;
        this.gridX = this.target.gridX;
        this.gridY = this.target.gridY;

        switch (this.state) {
            case "toResource": this.arrivedAtResource(); break;
            case "toBase": this.arrivedAtBase(); break;
            case "toStart": this.arrivedAtStart(); break;
        }
    }

    arrivedAtResource() {
        const baseGridX = Math.round(this.base.x / TILE_SIZE);
        const baseGridY = Math.round(this.base.y / TILE_SIZE);

        this.target.gridX = baseGridX;
        this.target.gridY = baseGridY;
        this.state = "toBase";
    }

    arrivedAtBase() {
        this.emit("delivery", {
            type: this.resource.type,
            amount: this.getResourceAmount()
        });

        this.target.gridX = this.startX;
        this.target.gridY = this.startY;
        this.state = "toStart";
    }

    arrivedAtStart() {
        this.state = "idle";
    }

    moveTowardsTarget(dt) {
        const moveStep = this.speed * dt * 100;
        const targetXpx = this.target.gridX * TILE_SIZE;
        const targetYpx = this.target.gridY * TILE_SIZE;

        const dx = targetXpx - this.x;
        const dy = targetYpx - this.y;

        if (Math.abs(dx) > 0.1) {
            this.x += Math.sign(dx) * Math.min(moveStep, Math.abs(dx));
        } else if (Math.abs(dy) > 0.1) {
            this.y += Math.sign(dy) * Math.min(moveStep, Math.abs(dy));
        }
    }

    getResourceAmount() {
        switch (this.resource.type) {
            case "rock": return ROCK_MINING_AMOUNT;
            case "iron": return IRON_MINING_AMOUNT;
            case "uranium": return URANIUM_MINING_AMOUNT;
            default: return 0;
        }
    }
}
