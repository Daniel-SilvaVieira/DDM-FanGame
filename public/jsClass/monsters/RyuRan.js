import { Monster } from "../Monster.js";

export class RyuRan extends Monster{
    constructor(owner) {
        super(
            'Ryu-Ran', owner ,'ryuRan.glb', 0.00015, 'ryuRanIcon.png', 3, null,
            'Add 3 Defense Crests to your Crest Counter.',
            'Dragon', null, 2, 20, 20, 10
        );
    }
}