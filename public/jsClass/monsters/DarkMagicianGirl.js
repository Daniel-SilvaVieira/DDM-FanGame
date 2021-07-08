import { Monster } from "../Monster.js";

export class DarkMagicianGirl extends Monster{
    constructor(owner) {
        super(
            'Dark Magician Girl', owner ,'darkMagicianGirl.glb', 0.2, 'darkMagicianGirlIcon.png', 2, null,
            'Add one Magic Crest to your Crest Counter.',
            'Dark', null, 2, 20, 20, 20
        );
    }
}