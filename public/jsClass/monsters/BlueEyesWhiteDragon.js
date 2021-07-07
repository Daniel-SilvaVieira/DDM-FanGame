import { Monster } from "../Monster.js";

export class BlueEyesWhiteDragon extends Monster{
    constructor(owner) {
        super(
            'Blue-Eyes White Dragon', owner ,'blueEyesWhiteDragon.glb', 0.0006, 'bluEyesWhiteDragonIcon.png', null, null,
            '', 'Dragon', 'Flying', 4, 50 , 40, 30
        );
    }
}