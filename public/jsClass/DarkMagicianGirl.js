import { Monster } from "./Monster.js";

export class RyuRan extends Monster{
    constructor(owner) {
        super(
            'Dark Magician Girl', owner ,'darkMagicianGirl.fbx', 0.02, 'ryuRanIcon.png', 2, null,
            'Add one Magic Crest to your Crest Counter.',
            'Dark', null, 2, 20, 20, 20
        );
    }
}