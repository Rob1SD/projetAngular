import { PokemonArenaComponent } from "../components/pokemon-arena/pokemon-arena.component";
export class PokemonAttack {
  public name : string;
  public power : number;
  public accuracy : number;
  public ppActuel : number;
  public pp : number;
  public damageClass : string;
  constructor(dataFromService) {
    console.log("attaq");
    console.log(dataFromService);
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


export function getFirstAttacker(p1: Pokemon, p2: Pokemon) {
    return p1.speed > p2.speed ? p1 : p2;
}

function playerTurn(p1: Pokemon, p2: Pokemon) {

}

export async function fight(p1: Pokemon, p2: Pokemon, arenaComponent : PokemonArenaComponent) {
  console.log(p1.attackList)
  console.log(p2.attackList)
    const player1: Pokemon = getFirstAttacker(p1, p2);
    const player2: Pokemon = player1 === p1 ? p2 : p1;
    let turn = 1;
    arenaComponent.write(new Date().toDateString());
    while (player1.healthPoint > 0 && player2.healthPoint > 0) {
        arenaComponent.write('===Tour : ' + turn + '===');
        await pause(player1, player2);

        arenaComponent.write(player1.nom + ' lance '+ player1.lastAttaqueUsed.name, player1.color);
        if (player2.lastDammageTaken > -1) {
          await arenaComponent.shake(player2);
          arenaComponent.write(player2.nom + ' perd ' + player2.lastDammageTaken + ' hp');
        }
        else {
          arenaComponent.write(player1.nom + ' rate son attaque !');
        }

        if (player2.healthPoint > 0) {
            await pause(player2, player1);

          arenaComponent.write(player2.nom + ' lance '+ player2.lastAttaqueUsed.name, player2.color);
          if (player1.lastDammageTaken > -1) {
            await arenaComponent.shake(player1);
            arenaComponent.write(player1.nom + ' perd ' + player1.lastDammageTaken + ' hp');
          }
          else {
            arenaComponent.write(player2.nom + ' rate son attaque !');
          }


        }
        ++turn;

    }



}
export function getWinner(p1: Pokemon, p2: Pokemon, arenaComponent : PokemonArenaComponent) {
    const winner = p1.healthPoint > 0 ? p1 : p2;
    arenaComponent.death(winner);
    return winner;
    
}
function pause(p1: Pokemon, p2: Pokemon) {
    return new Promise(resolve => setTimeout(() => {
        p1.attack(p2);
        resolve();
    }, 1500));
}

// let pika = new Pokemon ("Pikachu",90,22, 100);
// let sala = new Pokemon("Salameche",80,22,110);
// let winner = new Pokemon("toto",80,22,110);
//
// fight(pika,sala).then(function(){
//     winner = getWinner(pika,sala);
//     console.log("le gagnant est " + winner.nom);
// });

