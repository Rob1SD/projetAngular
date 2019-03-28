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
    }

    ngOnInit() {
        
        const fillAttackList = (data: IPokemon) => {
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

        const pokemonGetter = (name: string, color: string = "blue") => this.poke.GetPokemonByName(name).pipe(
            map(data => {
                const pokemon = new Pokemon(data, color);
                return { attacks: fillAttackList(data), pokemon };
            }),
            flatMap(dataArr => {
                let mapedArray = dataArr.attacks.map(val => this.poke.GetPokemonAttackUrl(val.move.url));
                mapedArray.unshift(of(dataArr.pokemon));
                return forkJoin(mapedArray);
            })
        );

        forkJoin(pokemonGetter("bulbasaur"),pokemonGetter("pikachu")).subscribe(ar => {
            //"bulbasaur"
            const pokeData1 = ar[0];
            this.pokemon1 = pokeData1.shift() as Pokemon;
            this.pokemon1.setAttackList(ar[0]);

            const pokeData2 = ar[1];
            this.pokemon2 = pokeData2.shift() as Pokemon;
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
            await (async () => {
                for (var i = 0; i <= 3; i++) {
                    if (pokemon === this.pokemon2) {

                        this.enp = "enpimgmove";
                        await this.delay(delayTime);
                        this.enp = "enpimg";
                        await this.delay(delayTime);

                    } else if (pokemon === this.pokemon1) {

                        this.myp = "mypimgmove";
                        await this.delay(delayTime);
                        this.myp = "mypimg";
                        await this.delay(delayTime);

                    }
                }
            })();
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
}
