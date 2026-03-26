class WorkerUnit extends Unit {
    constructor(id, x, y, playerId, base) {
        const assetKey = (playerId === 1) ? "WORKER_BLUE" : "WORKER_GREEN";
        super(id, x, y, assetKey, playerId, WORKER_HP, WORKER_SPEED);

        this.base = base;
        this.target = {x:null, y:null};
        this.resourceLocation = { x: null, y: null };
        this.hasTarget = false;
        this.isReturning = false;

        this.miningSpeed = MINING_SPEED;
    }

    setTarget(x, y) {
        this.resourceLocation.x = x;
        this.resourceLocation.y = y;

        this.target.x = this.resourceLocation.x;
        this.target.y = this.resourceLocation.y;

        this.isReturning = false;
        this.hasTarget = true;
    }

    update() {
        if (!this.hasTarget) return;

        const distX = this.target.x - this.x;
        const distY = this.target.y - this.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance > this.speed) {
            this.x += (distX / distance) * this.speed;
            this.y += (distY / distance) * this.speed;
        } else {
            this.x = this.target.x;
            this.y = this.target.y;

            if (!this.isReturning) {
                this.isReturning = true;
                this.target.x = this.base.x;
                this.target.y = this.base.y;
                console.log("Nyersanyag begyűjtve, irány a bázis!");
            } else {
                this.isReturning = false;
                this.target.x = this.resourceLocation.x;
                this.target.y = this.resourceLocation.y;
                console.log("Leadva! Megyek vissza bányászni.");
            }
        }
    }
}