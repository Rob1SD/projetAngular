import { Component } from '@angular/core';
import { IPokemon } from "./models/IPokemon";
import {fight, getWinner, Pokemon} from './models/class_pokemon';
import {PokemonService} from './pokemon.service';
import {forkJoin} from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'le meilleur pokemon arena, crée par Félix Alexandre, Pougetoux Jean et Soldé Robin';
  constructor(public pokeservice: PokemonService){
    let poke1: Pokemon;
    let poke2: Pokemon;
    const unsub = forkJoin(
      pokeservice.GetPokemonByName("mew"),
      pokeservice.GetPokemonByName("pikachu")
    ).subscribe(obsArray => {
      poke1 = new Pokemon(obsArray[0]);
      poke2 = new Pokemon(obsArray[1]);
      console.log(poke1);
      console.log(poke2);
      fight(poke1,poke2).then(() =>{
        let winner = getWinner(poke1, poke2);
        console.log('Le gagnant est ' + winner.nom);
      });


      unsub.unsubscribe();

    })




  }

}
