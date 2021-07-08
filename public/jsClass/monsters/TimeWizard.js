import { Monster } from "../Monster.js";

export class TimeWizard extends Monster{
    constructor(owner) {
        super(
            'Time Wizard', owner ,'timeWizard.glb', 0.0002, 'timeMagicianIcon.png', 0, null,
            'When this monster is summoned, you can destroy the monster in the dungeon with the lowest Attack Power.<br/>'+
		    'If there are 2 or more monsters with the same Attack Power points, you have to choose one as a target.',
            'Dark', null, 1, 10, 0, 10
        );
    }
}