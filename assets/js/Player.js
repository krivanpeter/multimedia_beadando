import Base from './Buildings/Base.js';
import Resource from './Resource.js';
import Unit from './Units/Unit.js';
import WorkerUnit from './Units/WorkerUnit.js';
import { ACTION_POINTS } from './initSettings.js';

export default class Player {
    constructor(name, id, color, baseX, baseY) {
        this.name = name;
        this.id = id;
        this.color = color;
        this.entities = [];
        this.resources = { rock: 0, iron: 0, uranium: 0 }
        this.selectedUnit = null;
        this.ap = ACTION_POINTS;
        this.init(baseX, baseY);
    }

    init(x, y) {
        this.base = new Base(`b${this.id}`, x, y, this.color);
        this.entities.push(this.base);

        let workerX = (this.id === 1) ? x + 1 : x - 1;
        let worker = new WorkerUnit(`wu${this.id}`, workerX, y, this.id, this.base);

        worker.on('delivery', (data) => {
            this.addResource(data.type, data.amount);
        });

        this.entities.push(worker);
    }

    addResource(type, amount) {
        this.resources[type] += amount;
        let newVal = parseInt($("#" + type + this.id).text()) + parseInt(amount);
        $("#" + type + this.id).text(newVal);
    }

    handleInteraction(target, gridPos, ap) {
        if (target instanceof Unit && target.playerId === this.id) {
            this.selectUnit(target);
        } else if (this.selectedUnit && this.selectedUnit.state === "idle") {
            this.issueCommand(target, gridPos, ap);
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

    issueCommand(target, gridPos, ap) {
        if (target instanceof Resource) {
            this.selectedUnit.setTarget("res", target);
        } else {
            this.selectedUnit.setTarget("pos", gridPos);
        }
        this.selectedUnit.isHighlighted = false;
        this.selectedUnit = null;
        this.updateAp(ap);
    }

    updateAp(ap = null) {
        if (ap == null) this.ap = ACTION_POINTS;
        this.ap -= ap;
        $("#ap").text(this.ap);
    }

    draw(ctx, spriteSheet) {
        this.entities.forEach(entity => {
            entity.draw(ctx, spriteSheet);
        });
    }
}