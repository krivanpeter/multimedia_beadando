import Unit from './Unit.js';

export default class TRUCK extends Unit {
    constructor(id, x, y, playerId) {
        const assetKey = (playerId === 1) ? "TRUCK_BLUE" : "TRUCK_GREEN";
        super(id, x, y, assetKey, playerId, TRUCK_HP, TRUCK_SPEED, COST.TRUCK);
    }
}
