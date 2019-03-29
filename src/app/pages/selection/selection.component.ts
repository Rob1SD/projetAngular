import { Component, OnInit, Input } from '@angular/core';
import { IPokemon } from 'src/app/models/IPokemon';
import { map, flatMap, tap } from 'rxjs/operators';
import { Pokemon } from 'src/app/models/class_pokemon';
import { of, forkJoin } from 'rxjs';
import { PokemonService } from 'src/app/pokemon.service';
import { BattleService } from 'src/app/battle.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PokemonPreview } from 'src/app/models/pokemon_preview';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  pokeList : PokemonPreview[];
  errorMessage : string;
  
  constructor(public poke: PokemonService, public battleService: BattleService, public router: Router, public route: ActivatedRoute) { }

  ngOnInit() {
    this.pokeList = [];
    var service = this.poke.GetPokemonList().subscribe((data: { results:any[]}) => {
      console.log(data);
      data.results.forEach(element => {
        this.pokeList.push(new PokemonPreview(element.name));
      });
      service.unsubscribe();
    });
  }

  onPokelement(pokemon : PokemonPreview, select : number) {
    if(select != 1 && select != 2) {
      throw new Error("Select should be 1 or 2");
    }
    
    if(select == 1) {
      var selected = pokemon.selected1;
      this.pokeList.forEach(element => {
        element.selected1 = false;
      });
      pokemon.selected1 = !selected;
    }
    else if (select == 2) {
      var selected = pokemon.selected2;
      this.pokeList.forEach(element => {
        element.selected2 = false;
      });
      pokemon.selected2 = !selected;
    }
  }

  validate() {
    this.errorMessage = "";

    var poke1 : PokemonPreview;
    var poke2 : PokemonPreview;

    this.pokeList.forEach(element => {
      if(element.selected1) {
        poke1 = element;
      }
      if (element.selected2) {
        poke2 = element;
      }
    });

    console.log(poke1);
    console.log(poke2);

    if(poke1 == null || poke2 == null) {
        this.errorMessage = "Il manque un ou deux pokemons !";
        return;
    }
    else {
      this.router.navigate([`../${poke1.nom}/${poke2.nom}`], { relativeTo: this.route });
    }
  }
}
