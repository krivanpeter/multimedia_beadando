import Unit from './Unit.js';
import { UNIT_DATA } from '../initSettings.js';

export default class WorkerUnit extends Unit {
    constructor(id, gridX, gridY, playerId, base, type = "WORKER") {
        const color = (playerId === 1) ? "BLUE" : "GREEN";
        const dynamicAssetKey = `${UNIT_DATA[type].ASSET}_${color}`;
        super(id, gridX, gridY, dynamicAssetKey, playerId, UNIT_DATA[type].hp, UNIT_DATA[type].COST);
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
        let newWorker = new WorkerUnit(this.id, this.startX, this.startY, this.playerId, this.base);
        newWorker.currentHp = this.currentHp;
        newWorker.type = this.type;
        newWorker.asset = this.asset;
        newWorker.x = this.x;
        newWorker.y = this.y;
        return newWorker
    }
}
