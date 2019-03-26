export class Pokemon {
    public nom: string;
    public speed: number;
    public attackDmg: number;
    public healthPoint: number;
    public level: number;
    public defense: number;


    constructor(NOM, SPEED, ATTACKDMG, HEALTHPOINT) {
        this.nom = NOM;
        this.speed = SPEED;
        this.attackDmg = ATTACKDMG;
        this.healthPoint = HEALTHPOINT;
       // console.log(this.nom);
    }

    attack(pokemon: Pokemon) {
        pokemon.healthPoint = pokemon.healthPoint - this.attackDmg < 0 ? 0 : pokemon.healthPoint - this.attackDmg;

    }


    private LevelMultiplier = (): number => (2*this.level) / 5 + 2;

    private AttackDefenseRatio = (defense: number): number => this.attackDmg / defense; 

    private CoreDamage = (target: Pokemon, power: number) => this.LevelMultiplier() * this.AttackDefenseRatio(target.defense) * power;

    public Damage = (target: Pokemon, attackPower: number) => this.CoreDamage(target, attackPower)/50 + 2;
}


export function getFirstAttacker(p1: Pokemon, p2: Pokemon) {
    return p1.speed > p2.speed ? p1 : p2;
}
function playerTurn(p1: Pokemon, p2: Pokemon) {

}
export async function fight(p1: Pokemon, p2: Pokemon) {
    const player1: Pokemon = getFirstAttacker(p1, p2);
    const player2: Pokemon = player1 === p1 ? p2 : p1;
    let turn = 1;
    while (player1.healthPoint > 0 && player2.healthPoint > 0) {
        console.log('===================================================');
        console.log('Tour : ' + turn)
        console.log(player1.nom + ' : ' + player1.healthPoint + ' hp');
        console.log(player2.nom + ' : ' + player2.healthPoint + ' hp');
        await pause(player1, player2);
        console.log(player1.nom + ' attaque ' + player2.nom)
        console.log(player2.nom + ' : ' + player2.healthPoint + ' hp');
        if (player2.healthPoint > 0) {
            await pause(player2, player1);
            console.log(player2.nom + ' attaque ' + player1.nom)
            console.log(player1.nom + ' : ' + player1.healthPoint + ' hp');

        }
        ++turn;

    }



}
export function getWinner(p1: Pokemon, p2: Pokemon) {
    return p1.healthPoint > 0 ? p1 : p2;
}
function pause(p1: Pokemon, p2: Pokemon) {
    return new Promise(resolve => setTimeout(() => {
        p1.attack(p2);
        resolve();
    }, 1000));
}

// let pika = new Pokemon ("Pikachu",90,22, 100);
// let sala = new Pokemon("Salameche",80,22,110);
// let winner = new Pokemon("toto",80,22,110);
//
// fight(pika,sala).then(function(){
//     winner = getWinner(pika,sala);
//     console.log("le gagnant est " + winner.nom);
// });

