import WorkerUnit from './WorkerUnit.js';

export default class Truck extends WorkerUnit {
    constructor(id, gridX, gridY, playerId, base) {
        super(id, gridX, gridY, playerId, base, "TRUCK", null);
    }
}
