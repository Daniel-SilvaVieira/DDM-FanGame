export class Monster {
    static lastID = 0;

    constructor(name, owner ,modelFilename, scale, iconFilename, effectCost, costType, effectDesc, type, movement, level, hp, atk, def) {
        this.id = Monster.lastID;
        this.name = name;
        this.owner = owner;
        this.modelFilename = modelFilename;
        this.scale = scale;
        this.iconFilename = iconFilename;
        this.effectCost = effectCost;
        this.costType = costType;
        this.effectDesc = effectDesc;
        this.type = type;
        this.movement = movement;
        this.level = level;
        this.maxHp = hp;
        this.leftHp = hp;
        this.atk = atk;
        this.def = def;
        this.available = true;
        this.hasAttacked = false;
        this.dead = false;

        Monster.lastID++
    }
}