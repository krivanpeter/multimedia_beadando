class Player {
    constructor(id, baseX, baseY) {
        this.id = id;
        this.entities = [];
        this.base = null;
        this.health = 100;
        this.rock = 0;
        this.iron = 0;
        this.uranium = 0;

        this.init(baseX, baseY);
    }

    init(x, y) {
        this.base = new Base(`b${this.id}`, x, y, this.id);
        this.entities.push(this.base);

        let workerX = (this.id === 1) ? x + 1 : x - 1;
        this.entities.push(new WorkerUnit(`wu${this.id}`, workerX, y, this));
    }

    addResource(type, amount) {
        this[type] += amount;
        console.log(`Player ${this.id} új készlete: ${type} = ${this[type]}`);
    }

    draw(ctx, spriteSheet) {
        this.entities.forEach(entity => {
            entity.draw(ctx, spriteSheet);
        });
    }
}