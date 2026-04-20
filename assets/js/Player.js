import Base from './Base.js';
import EventEmitter from './EventEmitter.js';
import Resource from './Resource.js';
import Unit from './Units/Unit.js';
import WorkerUnit from './Units/WorkerUnit.js';
import { ACTION_POINTS } from './initSettings.js';

export default class Player extends EventEmitter {
    constructor(name, id, color, baseX, baseY) {
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
        this.base = new Base(`b${this.id}`, x, y, this.color);

        let workerX = (this.id === 1) ? x + 1 : x - 1;
        let worker = new WorkerUnit(`wu${this.id}`, workerX, y, this.id, this.base);

        this.initEmitListeners(worker);

        this.entities.push(worker);
    }

    addResource(type, amount) {
        this.resources[type] += amount;
        this.emit("updateRes", this.resources);
    }

    handleInteraction(target, gridPos) {
        if (target instanceof Unit && target.playerId === this.id) {
            this.selectUnit(target);
        } else if (this.selectedUnit && this.selectedUnit.state === "idle") {
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
        this.emit("updateAp", {});
    }

    updateAp(ap = null) {
        if (ap === null) {
            this.ap = ACTION_POINTS;
        } else {
            this.ap -= ap;
        }
    }

    draw(ctx, spriteSheet) {
        this.base.draw(ctx, spriteSheet);
        this.entities.forEach(entity => {
            entity.draw(ctx, spriteSheet);
        });
    }

    initEmitListeners(worker, player=this) {
        worker.on('delivery', (data) => {
            player.addResource(data.type, data.amount);
        });
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