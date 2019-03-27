import { PokemonArenaComponent } from "../components/pokemon-arena/pokemon-arena.component";
export class PokemonAttack {
  public name : string;
  public power : number;
  public ppActuel : number;
  public pp : number;
  public damageClass : string;
  constructor(dataFromService) {
    this.name = dataFromService.names[6].name;
    this.power = dataFromService.power;
    this.pp = dataFromService.pp;
    this.ppActuel = dataFromService.pp;
    this.damageClass = dataFromService.damage_class.name;

  }
}
export class Pokemon {

    public nom: string;
    public speed: number;
    public attackDmg: number;
    public healthPoint: number;
    public totalHealthPoint: number;
    public level: number;
    public defense: number;
    public frontImage: string;
    public backImage: string;
    public attackList: PokemonAttack[];


    constructor(dataFromService) {
        this.level = 1;
        this.nom = dataFromService.name;
        this.speed = dataFromService.stats[0].base_stat;
        this.attackDmg = dataFromService.stats[4].base_stat;
        this.totalHealthPoint = dataFromService.stats[5].base_stat;
        this.healthPoint = dataFromService.stats[5].base_stat;
        this.defense = dataFromService.stats[3].base_stat;
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
        this.Damage(pokemon);

    }


    private LevelMultiplier = (): number => (2*this.level) / 5 + 2;

    private AttackDefenseRatio = (defense: number): number => this.attackDmg / defense; 

    private CoreDamage = (target: Pokemon, power: number) => this.LevelMultiplier() * this.AttackDefenseRatio(target.defense) * power;

    public Damage(target: Pokemon, attackPower: number = 30) {
        const dmgTaken = this.CoreDamage(target, attackPower)/50 + 2;
        const tmpHealth = Math.floor(target.healthPoint - dmgTaken);
        target.healthPoint = tmpHealth > 0 ? tmpHealth : 0;
    }
}


export function getFirstAttacker(p1: Pokemon, p2: Pokemon) {
    return p1.speed > p2.speed ? p1 : p2;
}

function playerTurn(p1: Pokemon, p2: Pokemon) {

}

export async function fight(p1: Pokemon, p2: Pokemon, arenaComponent : PokemonArenaComponent) {
    const player1: Pokemon = getFirstAttacker(p1, p2);
    const player2: Pokemon = player1 === p1 ? p2 : p1;
    let turn = 1;
    while (player1.healthPoint > 0 && player2.healthPoint > 0) {
        arenaComponent.write('===');
        arenaComponent.write('Tour : ' + turn);
        arenaComponent.write(player1.nom + ' : ' + player1.healthPoint + ' hp');
        arenaComponent.write(player2.nom + ' : ' + player2.healthPoint + ' hp');
        await pause(player1, player2);
        await arenaComponent.shake(player2);
        arenaComponent.write(player1.nom + ' attaque ' + player2.nom);
        arenaComponent.write(player2.nom + ' : ' + player2.healthPoint + ' hp');
        if (player2.healthPoint > 0) {
            await pause(player2, player1);
            await arenaComponent.shake(player1);
            arenaComponent.write(player2.nom + ' attaque ' + player1.nom);
            arenaComponent.write(player1.nom + ' : ' + player1.healthPoint + ' hp');

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

