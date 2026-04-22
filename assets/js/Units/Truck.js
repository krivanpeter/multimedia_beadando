import WorkerUnit from './WorkerUnit.js';

export default class Truck extends WorkerUnit {
    constructor(gridX, gridY, playerId, base) {
        super(gridX, gridY, playerId, base, "TRUCK");
    }

    moveTowardsTarget(dt){
        super.moveTowardsTarget(dt, "default")
    }
}
