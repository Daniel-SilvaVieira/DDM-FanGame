import { Monster } from "./Monster.js";

export class CursedDragon extends Monster{
    constructor(owner) {
        super(
            'Cursed dragon', owner ,'cursedDragon.fbx', 0.01, 'CursedDragonIcon.png', null, null,
            'Add 3 Defense Crests to your Crest Counter.',
            'Dragon', 'Flying', 3, 20, 20, 20
        );
    }
}