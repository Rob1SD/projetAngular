import { Component } from '@angular/core';
import { PokemonService } from './pokemon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'le meilleur pokemon arena, crée par Félix Alexandre, Pougetoux Jean et Soldé Robin';


  constructor(poke: PokemonService) {
    const unsub = poke.GetPokemonByName('ditto').subscribe( (data: IPokemon) => {
      console.log(data);
      unsub.unsubscribe();
    });

    const unsub2 = poke.GetPokemonById(1).subscribe((data: IPokemon) => {
      console.log(data);
      unsub2.unsubscribe();
    });
  }

}
