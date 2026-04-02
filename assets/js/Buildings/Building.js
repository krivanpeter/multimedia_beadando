import MapObject from '../MapObject.js';

export default class Building extends MapObject {
    constructor(id, gridX, gridY, assetKey, playerId, hp) {
        super(id, gridX, gridY, assetKey);
        this.playerId = playerId;
        this.hp = hp;
    }
}

