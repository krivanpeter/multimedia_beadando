import Entity from '../Entity.js';

export default class Building extends Entity {
    constructor(id, gridX, gridY, assetKey, playerId, hp) {
        super(id, gridX, gridY, assetKey);
        this.playerId = playerId;
        this.hp = hp;
    }
}

