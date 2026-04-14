import Entity from '../Entity.js';

export default class Unit extends Entity {
    constructor(id, gridX, gridY, assetKey, playerId, maxHp, speed) {
        super(id, gridX, gridY, assetKey, playerId);
        this.maxHp = maxHp;
        this.currentHp = maxHp;
        this.speed = speed;

        this.target = { gridX: null, gridY: null };
        this.isMoving = false;
        this.clickable = true;
    }

    onClick(){
        this.clickable = false;
    }
}