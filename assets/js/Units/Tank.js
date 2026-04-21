import Unit from './Unit.js';
import { UNIT_DATA } from '../initSettings.js';

export default class Tank extends Unit {
    constructor(id, x, y, playerId) {
        const assetKey = (playerId === 1) ? "TANK_BLUE" : "TANK_GREEN";
        super(id, x, y, assetKey, playerId, UNIT_DATA.TANK.HP, UNIT_DATA.TANK.COST);

        this.attackDamage = UNIT_DATA.TANK.DAMAGE;
    }

    clone() {
        let cloned = new Tank(this.id, this.gridX, this.gridY, this.playerId);
        cloned.x = this.x;
        cloned.y = this.y;
        cloned.currentHp = this.currentHp;
        return cloned;
    }
}
