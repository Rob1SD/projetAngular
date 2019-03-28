import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../pokemon.service';
import { IPokemon } from "../../models/IPokemon";
import { fight, getWinner, Pokemon } from "../../models/class_pokemon";
import { forkJoin, of } from "rxjs";
import { flatMap, map } from 'rxjs/operators';


@Component({
    selector: 'app-pokemon-arena',
    templateUrl: './pokemon-arena.component.html',
    styleUrls: ['./pokemon-arena.component.scss']
})
export class PokemonArenaComponent implements OnInit {

    txt: string;
    pokemon1: Pokemon;
    pokemon2: Pokemon;
    enp: string;
    myp: string;
    displayText: string;

    constructor(public poke: PokemonService) {


        this.displayText = "";
        
        const fillAttackList = function (data) {
            const max = data.moves.length;
            const min = 0;
            const posArray: number[] = [];
            for (let i = 0; i < 4; ++i) {
                let randomPos = Math.floor(Math.random() * (max - min) + min);
                while (posArray.indexOf(randomPos) >= 0) {
                  randomPos = Math.floor(Math.random() * (max - min) + min);
                }
                posArray.push(randomPos);
            }

            return data.moves.filter((val, idx) => posArray.includes(idx));
        }

        const p1 = poke.GetPokemonByName("bulbasaur").pipe(

            map(data => {
                this.pokemon1 = new Pokemon(data, "blue");
                return fillAttackList(data);
            }),
            flatMap(dataArr => forkJoin(dataArr.map(val => poke.GetPokemonAttackUrl(val.move.url))))
        );

        const p2 = poke.GetPokemonByName("pikachu").pipe(

            map(data => {
                this.pokemon2 = new Pokemon(data, "red");
                return fillAttackList(data);
            }),
            flatMap(dataArr => forkJoin(dataArr.map(val => poke.GetPokemonAttackUrl(val.move.url))))

        );

        forkJoin(p1,p2).subscribe(ar => {
            this.pokemon1.setAttackList(ar[0]);
            this.pokemon2.setAttackList(ar[1]);
            //afficher message chargé
        });

        this.enp = "enpimg";
        this.myp = "mypimg";
    }

    animate() {
        fight(this.pokemon1, this.pokemon2, this).then(() => {
            const winner = getWinner(this.pokemon1, this.pokemon2, this);
            this.write('Le gagnant est ' + winner.nom, winner.color);
        });
    }

    public async shake(pokemon: Pokemon) {
        const delayTime = 80;
        if (pokemon === this.pokemon2) {
            await (async () => {
                for (var i = 0; i <= 3; i++) {
                    this.enp = "enpimgmove";

                    await this.delay(delayTime);

                    this.enp = "enpimg";

                    await this.delay(delayTime);
                }
            })();
        }
        else if (pokemon === this.pokemon1) {
            await (async () => {
                for (var i = 0; i <= 3; i++) {
                    this.myp = "mypimgmove";

                    await this.delay(delayTime);

                    this.myp = "mypimg";

                    await this.delay(delayTime);
                }
            })();
        }
    }

    public death(pokemon: Pokemon) {
        if (pokemon === this.pokemon1) {
            this.enp = "enpimgmove";
        }
        else if (pokemon === this.pokemon2) {
            this.myp = "mypimgmove";
        }
    }
    
    public write(text : string, color: string = "black") {
        this.displayText += text + "<br>";
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    ngOnInit() {
    }
}
