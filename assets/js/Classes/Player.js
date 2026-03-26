class Player {
    constructor(number, baseX, baseY) {
        this.number = number;
        this.entities = [];
        this.base = null;
        this.health = 100;
        this.rock = 0;
        this.iron = 0;
        this.uranium = 0;

        this.init(baseX, baseY);
    }

    init(x, y) {
        this.base = new Base(`b${this.number}`, x, y, this.number);
        this.entities.push(this.base);
        const workerX = (this.number === 1) ? x + 1 : x - 1;
        this.entities.push(new WorkerUnit(`wu${this.number}`, workerX, y, this.number, this.base));
    }

    draw() {
        this.entities.forEach(entity => {
            entity.draw();
        });
    }
}