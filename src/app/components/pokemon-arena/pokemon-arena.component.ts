import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../pokemon.service';
import { IPokemon } from "../../models/IPokemon";
import { fight, getWinner, Pokemon } from "../../models/class_pokemon";
import { forkJoin } from "rxjs";


@Component({
    selector: 'app-pokemon-arena',
    templateUrl: './pokemon-arena.component.html',
    styleUrls: ['./pokemon-arena.component.scss']
})
export class PokemonArenaComponent implements OnInit {

    txt : string;
    pokemon1 : Pokemon;
    pokemon2 : Pokemon;
    enp : string;
    myp : string;

    constructor(public poke: PokemonService) {

        const unsub = forkJoin(
            poke.GetPokemonByName("caterpie"),
            poke.GetPokemonByName("pikachu")
        ).subscribe(obsArray => {
            this.pokemon1 = new Pokemon(obsArray[0]);
            this.pokemon2 = new Pokemon(obsArray[1]);

            unsub.unsubscribe();

        })

        this.enp = "enpimg";
        this.myp = "mypimg";
    }

    animate(){
        fight(this.pokemon1, this.pokemon2, this).then(() =>{
            let winner = getWinner(this.pokemon1, this.pokemon2, this);
            console.log('Le gagnant est ' + winner.nom);
        });
    }

    public async shake(pokemon : Pokemon) {
        const delayTime=80;
        if (pokemon===this.pokemon2){
            await (async () => { 
                for(var i = 0; i <= 3; i++){
                    this.enp = "enpimgmove";

                    await this.delay(delayTime);

                    // Do something after
                    this.enp = "enpimg";

                    await this.delay(delayTime); 
                }
            })();   
        }
        else if (pokemon === this.pokemon1) {
            await (async () => { 
                for(var i = 0; i <= 3; i++){
                    this.myp = "mypimgmove";

                    await this.delay(delayTime);

                    // Do something after
                    this.myp = "mypimg";

                    await this.delay(delayTime); 
                }
            })();
        }
    }

    public death(pokemon : Pokemon) {
        if (pokemon === this.pokemon1) {
            this.enp = "enpimgdead";
        }
        else if (pokemon === this.pokemon2) {
            this.myp = "mypimgdead";
        }
    }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    ngOnInit() {
    }

}
