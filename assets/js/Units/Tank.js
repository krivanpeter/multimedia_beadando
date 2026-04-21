import Unit from './Unit.js';
import {UNIT_DATA} from '../initSettings.js';

export default class Tank extends Unit {
    constructor(id, x, y, playerId) {
        const assetKey = (playerId === 1) ? "TANK_BLUE" : "TANK_GREEN";
        super(id, x, y, assetKey, playerId, UNIT_DATA.TANK.HP, COST.TANK);

        this.attackDamage = TANK_AD;
    }
}
