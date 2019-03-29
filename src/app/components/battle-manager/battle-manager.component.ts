import { Component, OnInit, Input } from '@angular/core';
import { BattleService } from 'src/app/battle.service';
import {IPokemon, ISpecies} from 'src/app/models/IPokemon';
import { map, flatMap, tap } from 'rxjs/operators';
import { Pokemon } from 'src/app/models/class_pokemon';
import { of, forkJoin } from 'rxjs';
import { PokemonService } from 'src/app/pokemon.service';
import { GameStateService, State, FightState } from 'src/app/game-state.service';
import { dispatch } from 'rxjs/internal/observable/pairs';

@Component({
  selector: 'app-battle-manager',
  template: '<span></span>'
})
export class BattleManagerComponent implements OnInit {

  @Input() PokemonOneName: string;
  @Input() PokemonTwoName: string;

  constructor(public battleService: BattleService, public poke: PokemonService, public StateManager: GameStateService) { }

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
            return { attacks: fillAttackList(data), pokemon, species : data.species};
        }),
        // flatMap(dataArr => {
        //   let mapedArray = this.poke.GetPokemonSpeciesUrl(dataArr.species.url);
        //
        // }),
        flatMap(dataArr => {
          console.log("dataArr");
          console.log(dataArr);
          const mapedArray = dataArr.attacks.map(val => this.poke.GetPokemonAttackUrl(val.move.url));
          const pokecolor = this.poke.GetPokemonSpeciesUrl(dataArr.species.url).subscribe((data : ISpecies) => {
            console.log("data")
            console.log(data)
            dataArr.pokemon.color = data.color.name;
          });
          console.log("pokecolor")
          console.log(pokecolor)
          mapedArray.unshift(of(dataArr.pokemon));
          return forkJoin( mapedArray);
        })

    );

    forkJoin(pokemonGetter(this.PokemonOneName),pokemonGetter(this.PokemonTwoName)).subscribe(ar => {
        console.log("ar")
        console.log(ar)
        const pokeData1 = ar[0];
        this.battleService.PokemonOne = pokeData1.shift() as Pokemon;
        this.battleService.PokemonOne.setAttackList(ar[0]);
        console.log("this.battleService.PokemonOne")
        console.log(this.battleService.PokemonOne)
        console.log(this.battleService.PokemonOne.attackList);

        const pokeData2 = ar[1];
        this.battleService.PokemonTwo = pokeData2.shift() as Pokemon;
        this.battleService.PokemonTwo.setAttackList(ar[1]);
      console.log("this.battleService.PokemonTwo");
      console.log(this.battleService.PokemonTwo);
        console.log(this.battleService.PokemonTwo.attackList);
        //afficher message chargé
    });

    this.StateManager.StateClock.subscribe(data => this.dispatch(data));
  }

  private dispatch(data: State) {
    if(data.App === "FightStart") {
      const p1 = this.battleService.PokemonOne;
      const p2 = this.battleService.PokemonTwo;
      const newState = this.getFirstAttacker(p1, p2);
      this.StateManager.ChangeState(new State("FightOngoing",newState));
    }
    if(data.App === "FightOngoing") {
      if(data.Fight === "P1Attack") this.fight(this.battleService.PokemonOne, this.battleService.PokemonTwo);
      if(data.Fight === "P2Attack") this.fight(this.battleService.PokemonTwo, this.battleService.PokemonOne);
    }
  }


  private fight(p1: Pokemon, p2: Pokemon) {
    if(this.battleService.PokemonOne.healthPoint <= 0) {
      this.StateManager.ChangeState(new State("PokemonTwoWin", "None"));
      return;
    }
    else if(this.battleService.PokemonTwo.healthPoint <= 0) {
      this.StateManager.ChangeState(new State("PokemonOneWin", "None"));
      return;
    } else {

      p1.attack(p2);
      this.battleService.LoggerEmitter.next(p1.nom + " lance " + p1.lastAttaqueUsed.name);
      if(p2.lastDammageTaken >= 0) this.battleService.LoggerEmitter.next(p2.nom + " perd " + p2.lastDammageTaken + " pdv <br>"); 
      else this.battleService.LoggerEmitter.next(p1.nom + " rate son attaque !" + "<br>");
      this.StateManager.ChangeState(
        new State(this.StateManager.CurrentState.App, this.GetNextAttaquant(this.StateManager.CurrentState.Fight))
      )
    }
  }

  private GetNextAttaquant(state: FightState) {
    switch (state) {
      case "P1Attack": 
      return "P2Attack";

      case "P2Attack": 
      return "P1Attack";

      default:
      return "None";
    }
  }

  private getFirstAttacker(p1: Pokemon, p2: Pokemon) {
    return p1.speed > p2.speed ? "P1Attack" : "P2Attack";
  }
}
