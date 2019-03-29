export class PokemonAttack {
  public name : string;
  public power : number;
  public accuracy : number;
  public ppActuel : number;
  public pp : number;
  public damageClass : string;
  constructor(dataFromService) {
    this.name = dataFromService.names[6].name;
    this.power = dataFromService.power;
    this.pp = dataFromService.pp;
    this.accuracy = dataFromService.accuracy;
    this.ppActuel = dataFromService.pp;
    this.damageClass = dataFromService.damage_class.name;
    if (this.accuracy === null)
      this.accuracy =100;

  }
}
export class Pokemon {

    public nom: string;
    public speed: number;
    public attackDmg: number;
    public attackSpe: number;
    public healthPoint: number;
    public totalHealthPoint: number;
    public level: number;
    public defense: number;
    public defenseSpe: number;
    public frontImage: string;
    public backImage: string;
    public lastDammageTaken : number;
    public attackList: PokemonAttack[];
    public lastAttaqueUsed : PokemonAttack;
    public color : string;


    constructor(dataFromService, color : string) {
      console.log(dataFromService)
        this.level = 1;
        this.lastDammageTaken = 0;
        this.color = color;
        this.nom = dataFromService.name;
        this.speed = dataFromService.stats[0].base_stat;
        this.attackDmg = dataFromService.stats[4].base_stat;
        this.attackSpe = dataFromService.stats[2].base_stat;
        this.totalHealthPoint = dataFromService.stats[5].base_stat;
        this.healthPoint = dataFromService.stats[5].base_stat;
        this.defense = dataFromService.stats[3].base_stat;
        this.defenseSpe = dataFromService.stats[1].base_stat;
        this.frontImage = "https://play.pokemonshowdown.com/sprites/xyani/"+this.nom+".gif";
        this.backImage = "https://play.pokemonshowdown.com/sprites/xyani-back/"+this.nom+".gif";


        // this.attackList = dataFromService.names[6].nameS
    }
    
    setAttackList(dataAttacks) {
      this.attackList = dataAttacks.map(data => {
          return new PokemonAttack(data);
      });
    }

    attack(pokemon: Pokemon) {
        const max = 4;
        const min = 0;
        const randomPos = Math.floor(Math.random() * (max - min) + min);
        this.Damage(pokemon, this.attackList[randomPos]);
    }


    private LevelMultiplier = (): number => (2*this.level) / 5 + 2;

    private AttackDefenseRatio = (defense: number, attackDmg :number): number => attackDmg / defense;

    private CoreDamage = function(target: Pokemon, attack: PokemonAttack) {
      const attackDmg = attack.damageClass === "physical" ? this.attackDmg : this.attackSpe;
      const defense = attack.damageClass === "physical" ? target.defense : target.defenseSpe;
      return this.LevelMultiplier() * this.AttackDefenseRatio(defense, attackDmg) * attack.power;
    }

    public Damage(target: Pokemon, attack: PokemonAttack ) {
        this.lastAttaqueUsed = attack;

        if (attack.accuracy < 100) {
          const max = 100;
          const min = 0;
          const randomValue = Math.floor(Math.random() * (max - min) + min);
          if (randomValue > attack.accuracy) {
            target.lastDammageTaken = -1;
            return;
          }
        }
        const dmgTaken = this.CoreDamage(target, attack)/50;
        const tmpHealth = Math.floor(target.healthPoint - dmgTaken);

        target.lastDammageTaken = Math.floor(dmgTaken);
        target.healthPoint = tmpHealth > 0 ? tmpHealth : 0;
    }
}


