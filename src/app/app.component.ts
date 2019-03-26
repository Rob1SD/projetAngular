import { Component } from '@angular/core';
import { PokemonService } from './pokemon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(poke: PokemonService) {
    const unsub = poke.GetPokemonByName('ditto').subscribe( (data: IPokemon) => {
      console.log(data);
      unsub.unsubscribe();
    });
  }

  title = 'pokemonArena';
}
