import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../pokemon.service';
import { IPokemon } from "../../models/IPokemon";
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-pokemon-arena',
    templateUrl: './pokemon-arena.component.html',
    styleUrls: ['./pokemon-arena.component.scss']
})
export class PokemonArenaComponent implements OnInit {

    txt : string;
    pokemon1 : IPokemon;
    pokemon2 : IPokemon;

    constructor(public poke: PokemonService) {


        var unsub = poke.GetPokemonByName("charizard").subscribe( (data: IPokemon) => {
            this.pokemon1 = data;
            console.log(this.pokemon1);
            unsub.unsubscribe();
        });

        var unsub2 = poke.GetPokemonByName("mew").subscribe( (data: IPokemon) => {
            this.pokemon2 = data;
            console.log(this.pokemon2);
            unsub2.unsubscribe();
        });
    }

    ngOnInit() {
    }

}
