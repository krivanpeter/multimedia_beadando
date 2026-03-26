class WorkerUnit extends Unit {
    constructor(id, x, y, player) {
        const assetKey = (player.id === 1) ? "WORKER_BLUE" : "WORKER_GREEN";
        super(id, x, y, assetKey, player.id, WORKER_HP, WORKER_SPEED);

        this.owner = player;
        this.target = { x: null, y: null };
        this.resource = { x: null, y: null, type: null };
        this.hasTarget = false;
        this.isReturning = false;
    }

    setTarget(res) {
        this.resource.x = res.x;
        this.resource.y = res.y;
        this.resource.type = res.type;

        this.target.x = this.resource.x;
        this.target.y = this.resource.y;

        this.isReturning = false;
        this.hasTarget = true;
    }

    update(dt) {
        if (!this.hasTarget) return;

        const distX = this.target.x - this.x;
        const distY = this.target.y - this.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const moveStep = this.speed * dt * 100;

        if (distance > moveStep) {
            this.x += (distX / distance) * moveStep;
            this.y += (distY / distance) * moveStep;
        } else {
            this.x = this.target.x;
            this.y = this.target.y;

            if (!this.isReturning) {
                this.isReturning = true;
                this.target.x = this.owner.base.x;
                this.target.y = this.owner.base.y;
                console.log(this.resource.type + " begyűjtve, irány a bázis!");
            } else {
                this.isReturning = false;
                this.target.x = this.resource.x;
                this.target.y = this.resource.y;
                console.log(this.resource.type + " leadva! Megyek vissza bányászni.");
                this.owner.addResource(this.resource.type, this.getResourceAmount());
            }
        }
    }

    getResourceAmount() {
        switch (this.resource.type) {
            case "rock":
                return ROCK_MINING_AMOUNT
            case "iron":
                return IRON_MINING_AMOUNT
            case "uranium":
                return URANIUM_MINING_AMOUNT
        }
    }

    onClick() {
        console.log("I'm clicked:", this);
        this.clicked = true;
    }
}