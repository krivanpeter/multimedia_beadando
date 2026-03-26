class Unit extends Entity {
    constructor(id, x, y, assetKey, playerId, maxHp, speed) {
        super(id, x, y, assetKey, playerId);
        this.maxHp = maxHp;
        this.currentHp = maxHp;
        this.speed = speed;

        this.target = { x: null, y: null };
        this.isMoving = false;
        this.clickable = true;
    }
}