class Tank extends Unit {
    constructor(id, x, y, playerId) {
        const assetKey = (playerId === 1) ? "TANK_BLUE" : "TANK_GREEN";
        
        super(id, x, y, assetKey, playerId, TANK_HP, TANK_SPEED);

        this.attackDamage = TANK_AD;
    }
}
