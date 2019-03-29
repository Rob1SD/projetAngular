import { Component, OnInit, Input } from '@angular/core';
import { IPokemon } from 'src/app/models/IPokemon';
import { map, flatMap, tap } from 'rxjs/operators';
import { Pokemon } from 'src/app/models/class_pokemon';
import { of, forkJoin } from 'rxjs';
import { PokemonService } from 'src/app/pokemon.service';
import { BattleService } from 'src/app/battle.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  pokeList : Pokemon[];
  
  constructor(public poke: PokemonService, public battleService: BattleService) { }

  onPokelement() {
    
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

    forkJoin(pokemonGetter("pikachu"),pokemonGetter("mew")).subscribe(ar => {
        const pokeData1 = ar[0];
        this.battleService.PokemonOne = pokeData1.shift() as Pokemon;
        this.battleService.PokemonOne.setAttackList(ar[0]);
        console.log(this.battleService.PokemonOne.attackList);

        const pokeData2 = ar[1];
        this.battleService.PokemonTwo = pokeData2.shift() as Pokemon;
        this.battleService.PokemonTwo.setAttackList(ar[1]);
        console.log(this.battleService.PokemonTwo.attackList);
        this.pokeList = [this.battleService.PokemonOne, this.battleService.PokemonTwo];
    });
  }

}
