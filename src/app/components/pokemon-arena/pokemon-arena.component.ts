import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../pokemon.service';
import { IPokemon } from "../../models/IPokemon";


@Component({
    selector: 'app-pokemon-arena',
    templateUrl: './pokemon-arena.component.html',
    styleUrls: ['./pokemon-arena.component.scss']
})
export class PokemonArenaComponent implements OnInit {

    txt : string;
    pokemon1 : IPokemon;
    pokemon2 : IPokemon;
    enp : string;
    myp : string;

    constructor(public poke: PokemonService) {


        var unsub = poke.GetPokemonByName("ponyta").subscribe( (data: IPokemon) => {
            this.pokemon1 = data;
            console.log(this.pokemon1);
            unsub.unsubscribe();
        });

        var unsub2 = poke.GetPokemonByName("arceus").subscribe( (data: IPokemon) => {
            this.pokemon2 = data;
            console.log(this.pokemon2);
            unsub2.unsubscribe();
        });

        this.enp = "ennemy_pokemon";
        this.myp = "my_pokemon";
    }

    animate(){
        /*(async () => { 
            for(var i = 0; i <= 3; i++){
                this.enp = "ennemy_pokemon_move";

                await this.delay(200);

                // Do something after
                this.enp = "ennemy_pokemon";

                await this.delay(200); 
            }
        })();*/
        
        
    }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    ngOnInit() {
    }

}
