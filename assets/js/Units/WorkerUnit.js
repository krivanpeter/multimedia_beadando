import Unit from './Unit.js';
import { GAME_SPEED, UNIT_DATA } from '../initSettings.js';

export default class WorkerUnit extends Unit {
    constructor(gridX, gridY, playerId, base, type = "WORKER") {
        const color = (playerId === 1) ? "BLUE" : "GREEN";
        const dynamicAssetKey = `${UNIT_DATA[type].ASSET}_${color}`;
        super(gridX, gridY, dynamicAssetKey, playerId, UNIT_DATA[type].HP, UNIT_DATA[type].COST, UNIT_DATA[type].SOUNDS);
        this.type = type;
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

    moveTowardsTarget(dt, type = "wu") {
        if (type != "wu") {
            super.moveTowardsTarget(dt);
            return;
        }
        const moveStep = GAME_SPEED * dt * 100;
        const dx = this.targetXpx - this.x;
        const dy = this.targetYpx - this.y;

        if (Math.abs(dx) > 0.1) {
            this.x += Math.sign(dx) * Math.min(moveStep, Math.abs(dx));
        } else if (Math.abs(dy) > 0.1) {
            this.y += Math.sign(dy) * Math.min(moveStep, Math.abs(dy));
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
            amount: UNIT_DATA[this.type].MINING_AMOUNT[this.resource.type]
        });
        this.target.gridX = this.startX;
        this.target.gridY = this.startY;

        this.state = "toStart";
    }

    clone() {
        let clone = new WorkerUnit(this.startX, this.startY, this.playerId, this.base);
        clone.type = this.type;
        clone.startX = this.startX;
        clone.startY = this.startY;
        return super.clone(clone);
    }
}
