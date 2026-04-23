import { TILE_SIZE } from "./initSettings.js";
import Entity from "./Entity.js";

export default class Rocket extends Entity{
    constructor(gridX, gridY, playerId) {
        super(gridX, gridY, "ROCKET", playerId);
    }
}