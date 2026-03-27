import Base from './Buildings/Base.js';
import WorkerUnit from './Units/WorkerUnit.js';

export default class Player {
    constructor(number, baseX, baseY) {
        this.number = number;
        this.entities = [];
        this.rock = 0;
        this.iron = 0;
        this.uranium = 0;
        this.init(baseX, baseY);
    }

    init(x, y) {
        this.base = new Base(`b${this.number}`, x, y, this.number);
        this.entities.push(this.base);

        let workerX = (this.number === 1) ? x + 1 : x - 1;
        let worker = new WorkerUnit(`wu${this.number}`, workerX, y, this.number, this.base);

        // FELIRATKOZÁS: Figyeljük, ha a munkás lead valamit
        worker.on('delivery', (data) => {
            this.addResource(data.type, data.amount);
        });

        this.entities.push(worker);
    }

    addResource(type, amount) {
        if (this.hasOwnProperty(type)) {
            this[type] += amount;
            console.log(`Player ${this.number} kapott ${amount} egységnyi ${type}-ot!`);
        }
    }

    draw(ctx, spriteSheet) {
        this.entities.forEach(entity => {
            entity.draw(ctx, spriteSheet);
        });
    }
}