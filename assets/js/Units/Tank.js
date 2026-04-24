import Unit from './Unit.js';
import { UNIT_DATA } from '../initSettings.js';
import Rocket from '../Rocket.js';

export default class Tank extends Unit {
    constructor(gridX, gridY, playerId) {
        const assetKey = (playerId === 1) ? "TANK_BLUE" : "TANK_GREEN";
        super(gridX, gridY, assetKey, playerId, UNIT_DATA.TANK.HP, UNIT_DATA.TANK.COST, UNIT_DATA.TANK.SOUNDS);
        this.range = UNIT_DATA.TANK.RANGE;
        this.attackDamage = UNIT_DATA.TANK.DAMAGE;
        this.rockets = [];
    }

    shoot() {
        console.log("bumm");
        let rocket = new Rocket(this.gridX, this.gridY);
        this.rockets.push(rocket);
    }

    clone() {
        let clone = new Tank(this.gridX, this.gridY, this.playerId);
        return super.clone(clone);
    }
}
