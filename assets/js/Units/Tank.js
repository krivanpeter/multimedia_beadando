import Unit from './Unit.js';
import { UNIT_DATA } from '../initSettings.js';

export default class Tank extends Unit {
    constructor(x, y, playerId) {
        const assetKey = (playerId === 1) ? "TANK_BLUE" : "TANK_GREEN";
        super(x, y, assetKey, playerId, UNIT_DATA.TANK.HP, UNIT_DATA.TANK.COST, UNIT_DATA.TANK.SOUNDS);

        this.attackDamage = UNIT_DATA.TANK.DAMAGE;
    }

    clone() {
        let clone = new Tank(this.gridX, this.gridY, this.playerId);
        clone.maxHp = this.maxHp;
        clone.currentHp = this.currentHp;
        clone.asset = this.asset;
        clone.x = this.x;
        clone.y = this.y;
        clone.moveDirection = this.moveDirection
        clone.facing = this.facing
        clone.rotation = this.rotation;
        clone.flip = this.flip;
        clone.direction = this.direction;
        return clone;
    }
}
