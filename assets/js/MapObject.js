import Entity from './Entity.js';

export default class MapObject extends Entity {
    constructor(id, x, y, assetKey) {
        super(id, x, y, assetKey);
        this.clickable = true;
    }
}
