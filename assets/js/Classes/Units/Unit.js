class Unit extends Entity {
    constructor(id, x, y, assetKey, playerId, maxHp, speed) {
        super(id, x, y, assetKey, playerId);
        this.maxHp = maxHp;
        this.currentHp = maxHp;
        this.speed = speed;
        
        this.target = {x:null, y:null};
        this.isMoving = false;
    }

/*     setTarget(x, y) {
        this.target.x = x;
        this.target.y = y;
        this.isMoving = true;
    }

    update() {
        if (!this.isMoving) return;

        const distX = this.target.x - this.x;
        const distY = this.target.y - this.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance > this.speed) {
            this.x += (distX / distance) * this.speed;
            this.y += (distY / distance) * this.speed;
        } else {
            this.x = this.target.x;
            this.y = this.target.y;
            this.isMoving = false;
        }
    } */
}