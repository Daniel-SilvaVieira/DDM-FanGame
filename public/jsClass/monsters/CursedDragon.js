import { Monster } from "../Monster.js";

export class CursedDragon extends Monster{
    constructor(owner) {
        super(
            'Cursed dragon', owner ,'cursedDragon.glb', 0.01, 'CursedDragonIcon.png', null, null,
            '',
            'Dragon', 'Flying', 3, 20, 20, 20
        );
    }
}