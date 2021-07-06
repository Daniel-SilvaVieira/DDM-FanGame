import { Monster } from "./Monster.js";

export class SummonedSkull extends Monster{
    constructor(owner) {
        super(
            'Summoned skull', owner ,'summonedSkull.fbx', 0.0006, 'SummonedSkulIconl.png', null, null,
            '', 'Dark', null, 4, 40, 40, 20
        );
    }
}