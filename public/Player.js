export class Player {
    constructor(name, isPlayer, color, lifes, moves, attacks, shields, magics, traps) {
        this.name = name;
        this.isPlayer = isPlayer;
        this.color = color;
        this.lifes = lifes;
        this.moves = moves;
        this.attacks = attacks;
        this.shields = shields;
        this.magics = magics;
        this.traps = traps;
        this.monsters = [];
        this.summonedMonsters = [];
        this.graveyard = [];
    }
}