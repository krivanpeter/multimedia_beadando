import Base from './Buildings/Base.js';
import WorkerUnit from './Units/WorkerUnit.js';

export default class Player {
    constructor(number, baseX, baseY) {
        this.number = number;
        this.entities = [];
        this.resources = { rock: 0, iron: 0, uranium: 0 }
        this.init(baseX, baseY);
    }

    init(x, y) {
        this.base = new Base(`b${this.number}`, x, y, this.number);
        this.entities.push(this.base);

        let workerX = (this.number === 1) ? x + 1 : x - 1;
        let worker = new WorkerUnit(`wu${this.number}`, workerX, y, this.number, this.base);

        worker.on('delivery', (data) => {
            this.addResource(data.type, data.amount);
        });

        this.entities.push(worker);
    }

    addResource(type, amount) {
        this.resources[type] += amount;
        let newVal = parseInt($("#" + type + this.number).text()) + parseInt(amount);
        $("#" + type + this.number).text(newVal);
    }

    draw(ctx, spriteSheet) {
        this.entities.forEach(entity => {
            entity.draw(ctx, spriteSheet);
        });
    }
}