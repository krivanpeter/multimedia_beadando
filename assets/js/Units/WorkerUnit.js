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

        this.target = { gridX: null, gridY: null, x: null, y: null };
        this.resource = { gridX: null, gridY: null, type: null };

        this.state = "idle";
        this.hasTarget = false;
    }

    setTarget(res) {
        this.resource.gridX = res.gridX;
        this.resource.gridY = res.gridY;
        this.resource.type = res.type;

        const closest = this.getClosestAdjacentToBase(res.gridX, res.gridY);

        this.target.gridX = closest.gridX;
        this.target.gridY = closest.gridY;

        this.state = "toResource";
        this.hasTarget = true;
    }

    update(dt) {
        if (!this.hasTarget) return;

        const moveStep = this.speed * dt * 100;

        const targetXpx = this.target.gridX * TILE_SIZE;
        const targetYpx = this.target.gridY * TILE_SIZE;

        const dx = targetXpx - this.x;
        const dy = targetYpx - this.y;

        const arriveEps = 2;

        if (Math.abs(dx) <= arriveEps && Math.abs(dy) <= arriveEps) {
            this.x = targetXpx;
            this.y = targetYpx;
            this.gridX = this.target.gridX;
            this.gridY = this.target.gridY;

            if (this.state === "toResource") {
                console.log(this.resource.type + " begyűjtve");

                const baseGridX = Math.round(this.base.x / TILE_SIZE);
                const baseGridY = Math.round(this.base.y / TILE_SIZE);

                this.target.gridX = baseGridX;
                this.target.gridY = baseGridY;

                this.state = "toBase";
                return;
            }

            if (this.state === "toBase") {
                this.state = "idle";
                this.hasTarget = false;
                return;
            }

            return;
        }

        if (Math.abs(dx) > arriveEps) {
            let step = Math.sign(dx) * moveStep;
            if (Math.abs(step) > Math.abs(dx)) step = dx;
            this.x += step;
        } else if (Math.abs(dy) > arriveEps) {
            let step = Math.sign(dy) * moveStep;
            if (Math.abs(step) > Math.abs(dy)) step = dy;
            this.y += step;
        }

        this.gridX = this.x / TILE_SIZE;
        this.gridY = this.y / TILE_SIZE;
    }

    getClosestAdjacentToBase(resGridX, resGridY) {
        const baseGridX = Math.round(this.base.x / TILE_SIZE);
        const baseGridY = Math.round(this.base.y / TILE_SIZE);

        const candidates = [
            { gridX: resGridX - 1, gridY: resGridY },
            { gridX: resGridX + 1, gridY: resGridY },
            { gridX: resGridX, gridY: resGridY - 1 },
            { gridX: resGridX, gridY: resGridY + 1 },
        ];

        const list = candidates;

        const dist = (a) => Math.abs(a.gridX - baseGridX) + Math.abs(a.gridY - baseGridY);

        let best = list[0];
        let bestD = dist(best);

        for (let i = 1; i < list.length; i++) {
            const d = dist(list[i]);
            if (d < bestD) {
                best = list[i];
                bestD = d;
            }
        }

        return best;
    }

    getResourceAmount() {
        switch (this.resource.type) {
            case "rock": return ROCK_MINING_AMOUNT;
            case "iron": return IRON_MINING_AMOUNT;
            case "uranium": return URANIUM_MINING_AMOUNT;
            default: return 0;
        }
    }

    onClick() {
        console.log("I'm clicked:", this);
        this.clicked = true;
    }
}
