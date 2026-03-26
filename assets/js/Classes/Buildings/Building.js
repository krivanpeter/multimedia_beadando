class Building extends MapObject {
    constructor(id, x, y, assetKey, playerId, hp) {
        super(id, x, y, assetKey);
        this.playerId = playerId;
        this.hp = hp;
    }
}

