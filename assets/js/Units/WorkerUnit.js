import Unit from './Unit.js';
import {
    WORKER_HP,
    WORKER_SPEED,
    COST,
    ROCK_MINING_AMOUNT,
    IRON_MINING_AMOUNT,
    URANIUM_MINING_AMOUNT,
} from '../initSettings.js';

export default class WorkerUnit extends Unit {
    constructor(id, gridX, gridY, playerId, base) {
        const assetKey = (playerId === 1) ? "WORKER_BLUE" : "WORKER_GREEN";
        super(id, gridX, gridY, assetKey, playerId, WORKER_HP, WORKER_SPEED, COST.WORKER);

        this.base = base;
        this.startX = gridX;
        this.startY = gridY;

        this.resource = { gridX: null, gridY: null, type: null };
    }

    setTarget(type, res) {
        if (type === "res") {
            this.resource = { gridX: res.gridX, gridY: res.gridY, type: res.type };
            this.target.gridX = res.gridX;
            this.target.gridY = res.gridY;
            this.state = "toResource";
        } else {
            super.setTarget(res);
            this.state = "toTile";
        }
    }

    handleArrival() {
        const prevState = this.state;
        super.handleArrival();

        switch (prevState) {
            case "toResource":
                this.arrivedAtResource();
                break;
            case "toBase":
                this.arrivedAtBase();
                break;
            case "toStart":
                this.state = "idle";
                break;
        }
    }

    arrivedAtResource() {
        this.target.gridX = this.base.gridX;
        this.target.gridY = this.base.gridY;
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

    getResourceAmount() {
        switch (this.resource.type) {
            case "rock": return ROCK_MINING_AMOUNT;
            case "iron": return IRON_MINING_AMOUNT;
            case "uranium": return URANIUM_MINING_AMOUNT;
            default: return 0;
        }
    }

    clone() {
        let newWorker = new WorkerUnit(this.id, this.startX, this.startY, this.playerId, this.base);
        newWorker.currentHp = this.currentHp;
        newWorker.x = this.x;
        newWorker.y = this.y;
        return newWorker
    }
}
