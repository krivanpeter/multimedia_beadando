import Base from './Base.js';
import EventEmitter from './EventEmitter.js';
import Resource from './Resource.js';
import Unit from './Units/Unit.js';
import WorkerUnit from './Units/WorkerUnit.js';
import Truck from './Units/Truck.js';
import Tank from './Units/Tank.js';
import { ACTION_POINTS } from './initSettings.js';

export default class Player extends EventEmitter {
    constructor(name, id, color, baseX, baseY, resources) {
        super();
        this.name = name;
        this.id = id;
        this.color = color;
        this.base = null;
        this.entities = [];
        this.resources = { rock: 0, iron: 0, uranium: 0 }
        this.selectedUnit = null;
        this.ap = ACTION_POINTS;
        this.init(baseX, baseY);
    }

    init(x, y) {
        this.base = new Base(x, y, this.color, this.id);
        this.createWorkerUnit(x, y);
    }

    createUnit(UnitClass, gridX, gridY) {
        if (this.isTileOccupied(gridX, gridY)) {
            return null;
        }
        const unit = new UnitClass(gridX, gridY, this.id, this.base);
        this.initEmitListeners(unit);
        this.entities.push(unit);

        return unit;
    }

    createWorkerUnit(x, y) {
        const offset = (this.id === 1) ? 1 : -1;
        console.log(offset);
        this.createUnit(WorkerUnit, x + offset, y);
    }

    createTruck(x, y) {
        this.createUnit(Truck, x, y - 1);
    }

    createTank(x, y) {
        this.createUnit(Tank, x, y + 1);
    }

    isTileOccupied(gridX, gridY) {
        return this.entities.some(e => e.gridX === gridX && e.gridY === gridY);
    }

    addResource(type, amount) {
        this.resources[type] += amount;
        this.emit("updateRes", this.resources);
    }

    handleInteraction(target, gridPos) {
        if (target instanceof Unit && target.playerId === this.id) {
            this.selectUnit(target);
        } else if (target instanceof Unit && target.playerId !== this.id) {
            return;
        }
        else if (this.selectedUnit && this.selectedUnit.state === "idle") {
            const dist = Math.abs(gridPos.gridX - this.selectedUnit.gridX) +
                Math.abs(gridPos.gridY - this.selectedUnit.gridY);

            if (dist > 0 && this.ap >= dist) {
                this.issueCommand(target, gridPos, dist);
            } else if (dist > 0) {
                console.log("Nincs elég Action Point!");
            }
        }
    }

    selectUnit(unit) {
        if (this.selectedUnit) this.selectedUnit.isHighlighted = false;

        if (this.selectedUnit === unit) {
            this.selectedUnit = null;
        } else {
            this.selectedUnit = unit;
            this.selectedUnit.onClick();
        }
    }

    issueCommand(target, gridPos, apCost) {
        if (target instanceof Resource) {
            this.selectedUnit.setTarget("res", target);
        } else {
            this.selectedUnit.setTarget("pos", gridPos);
        }

        this.selectedUnit.isHighlighted = false;
        this.selectedUnit = null;
        this.updateAp(apCost);
    }

    updateAp(ap = null) {
        if (ap === null) {
            this.ap = ACTION_POINTS;
        } else {
            this.ap -= ap;
        }
        this.emit("updateAp", {});
    }

    draw(ctx, spriteSheet) {
        this.base.draw(ctx, spriteSheet);
        this.entities.forEach(entity => {
            entity.draw(ctx, spriteSheet);
        });
    }

    initEmitListeners(worker, player = this) {
        worker.on('delivery', (data) => {
            player.addResource(data.type, data.amount);
        });
    }

    removeResource(resType, resUnits) {
        this.resources[resType] -= resUnits;
        this.emit("updateRes", this.resources);
    }

    clone() {
        let player = new Player(this.name, this.id, this.color, this.base.gridX, this.base.gridY);
        player.ap = this.ap;
        player.resources = structuredClone(this.resources);

        player.entities = [];

        this.entities.forEach(entity => {
            let clonedEntity = entity.clone();
            if (clonedEntity.hasOwnProperty('base')) {
                clonedEntity.base = player.base;
            }
            if (clonedEntity instanceof WorkerUnit) this.initEmitListeners(clonedEntity, player);
            player.entities.push(clonedEntity);
        });

        return player;
    }
}