import Entity from './Entity.js';

export default class MapObject extends Entity {
    constructor(id, gridX, gridY, assetKey) {
        super(id, gridX, gridY, assetKey);
        this.clickable = true;
    }

    onClick(){
        console.log("clicked:", this);
    }
}
