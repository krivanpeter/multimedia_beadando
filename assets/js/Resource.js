import Entity from './Entity.js';

export default class Resource extends Entity {
    constructor(x, y, type) {
        const types = { rock: "ROCK", iron: "IRON", uranium: "URANIUM" };
        const assetKey = types[type];
        super(x, y, assetKey);
        this.type = type;
    }
}