import Entity from '../Entity.js';

export default class Building extends Entity {
    constructor(id, gridX, gridY, assetKey, playerColor, hp) {
        super(id, gridX, gridY, assetKey);
        this.playerColor = playerColor;
        this.hp = hp;
    }
}

