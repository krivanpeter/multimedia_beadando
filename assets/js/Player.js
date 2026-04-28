import Base from './Base.js';
import EventEmitter from './EventEmitter.js';
import Resource from './Resource.js';
import Unit from './Units/Unit.js';
import WorkerUnit from './Units/WorkerUnit.js';
import Truck from './Units/Truck.js';
import Tank from './Units/Tank.js';
import { ACTION_POINTS, WIN_COND_URANIUM } from './initSettings.js';

export default class Player extends EventEmitter {
    constructor(name, id, color, baseX, baseY, isCloning = false) {
        super();
        this.name = name;
        this.id = id;
        this.color = color;
        this.base = null;
        this.entities = [];
        this.resources = { rock: 0, iron: 0, uranium: 0 }
        this.selectedUnit = null;
        this.ap = ACTION_POINTS;
        if (!isCloning) {
            this.init(baseX, baseY);
        }
    }

    init(gridX, gridY) {
        const base = new Base(gridX, gridY, this.color, this.id);
        this.base = base;
        this.registerEntity(this.base);

        const offset = (this.id === 1) ? 1 : -1;
        this.createUnit(WorkerUnit, gridX + offset, gridY);
    }

    registerEntity(entity) {
        if (!entity) return;

        if (entity instanceof WorkerUnit) {
            entity.on('delivery', (data) => this.addResource(data.type, data.amount));
        }

        entity.on('died', () => this.handleEntityDeath(entity));

        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
        }
        return entity;
    }

    handleEntityDeath(entity) {
        this.entities = this.entities.filter(e => e !== entity);

        if (entity instanceof Base) {
            this.base = null;
            this.entities = [];
            this.emit("lost");
        }
    }

    createUnit(UnitClass, gridX, gridY) {
        if (this.isTileOccupied(gridX, gridY)) return null;

        const unit = new UnitClass(gridX, gridY, this.id, this.base);
        return this.registerEntity(unit);
    }

    createWorkerUnit(x, y) {
        return this.createUnit(WorkerUnit, x + offset, y);
    }

    createTruck(x, y) {
        return this.createUnit(Truck, x, y - 1);
    }

    createTank(x, y) {
        return this.createUnit(Tank, x, y + 1);
    }

    isTileOccupied(gridX, gridY) {
        return this.entities.some(e => e.gridX === gridX && e.gridY === gridY);
    }

    addResource(type, amount) {
        this.resources[type] += amount;
        this.emit("updateRes", this.resources);
        if(this.resources.uranium === WIN_COND_URANIUM){
            this.emit("won");
        }
    }

    removeResource(resType, resUnits) {
        this.resources[resType] -= resUnits;
        this.emit("updateRes", this.resources);
    }

    handleInteraction(target, gridPos) {
        if (target instanceof Unit && target.playerId === this.id) {
            this.selectUnit(target);
        } else if ((target instanceof Unit || target instanceof Base) && target.playerId !== this.id) {
            if (this.selectedUnit instanceof Tank && this.ap > 0) {
                const dist = Math.abs(target.gridX - this.selectedUnit.gridX) +
                    Math.abs(target.gridY - this.selectedUnit.gridY);
                if (dist <= this.selectedUnit.range) {
                    this.selectedUnit.shoot(target);
                    this.updateAp(1);
                }
            }
        }
        else if (target instanceof Base) {
            return
        }
        else if (this.selectedUnit && this.selectedUnit.state === "idle") {
            const dist = Math.abs(gridPos.gridX - this.selectedUnit.gridX) +
                Math.abs(gridPos.gridY - this.selectedUnit.gridY);

            if (dist > 0 && this.ap >= dist) {
                this.issueCommand(target, gridPos, dist);
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
        this.entities.forEach(entity => {
            entity.draw(ctx, spriteSheet);
            if (entity instanceof Tank && entity.rockets) {
                entity.rockets.forEach(r => r.draw(ctx, spriteSheet));
            }
        });
    }

    clone() {
        let clone = new Player(this.name, this.id, this.color, null, null, true);
        clone.ap = this.ap;
        clone.resources = structuredClone(this.resources);

        const entityMap = new Map();

        this.entities.forEach(entity => {
            const clonedEntity = entity.clone();
            entityMap.set(entity, clonedEntity);

            if (entity === this.base) {
                clone.base = clonedEntity;
            }
        });

        this.entities.forEach(oldEntity => {
            const newEntity = entityMap.get(oldEntity);

            if ('base' in newEntity) {
                newEntity.base = clone.base;
            }
            clone.registerEntity(newEntity);
        });

        return clone;
    }
}