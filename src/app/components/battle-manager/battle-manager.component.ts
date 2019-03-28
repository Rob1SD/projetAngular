import { Component, OnInit, Input } from '@angular/core';
import { BattleService } from 'src/app/battle.service';
import { IPokemon } from 'src/app/models/IPokemon';
import { map, flatMap, tap } from 'rxjs/operators';
import { Pokemon } from 'src/app/models/class_pokemon';
import { of, forkJoin } from 'rxjs';
import { PokemonService } from 'src/app/pokemon.service';
import { GameStateService, State } from 'src/app/game-state.service';
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
            return { attacks: fillAttackList(data), pokemon };
        }),
        flatMap(dataArr => {
            let mapedArray = dataArr.attacks.map(val => this.poke.GetPokemonAttackUrl(val.move.url));
            mapedArray.unshift(of(dataArr.pokemon));
            return forkJoin(mapedArray);
        })
    );

    forkJoin(pokemonGetter(this.PokemonOneName),pokemonGetter(this.PokemonTwoName)).subscribe(ar => {
        const pokeData1 = ar[0];
        this.battleService.PokemonOne = pokeData1.shift() as Pokemon;
        this.battleService.PokemonOne.setAttackList(ar[0]);
        console.log(this.battleService.PokemonOne.attackList);

        const pokeData2 = ar[1];
        this.battleService.PokemonTwo = pokeData2.shift() as Pokemon;
        this.battleService.PokemonTwo.setAttackList(ar[1]);
        console.log(this.battleService.PokemonTwo.attackList);
        //afficher message chargé
    });

    this.StateManager.StateClock.subscribe(data => this.dispatch(data));
  }

  private dispatch(data: State) {
    if(data.App == "FightStart") {
      const p1 = this.battleService.PokemonOne;
      const p2 = this.battleService.PokemonTwo;
      const newState = this.getFirstAttacker(p1, p2);
      this.StateManager.ChangeState(new State("FightOngoing",newState));
    }
    if(data.App == "FightOngoing") {
      if(data.Fight == "P1Attack") this.fight(this.battleService.PokemonOne, this.battleService.PokemonTwo);
      if(data.Fight == "P2Attack") this.fight(this.battleService.PokemonTwo, this.battleService.PokemonOne);
    }
  }


  private fight(p1: Pokemon, p2: Pokemon) {
    if(this.battleService.PokemonOne.healthPoint <= 0) {
      this.StateManager.ChangeState(new State("PokemonTwoWin", "None"));
      return;
    }
    if(this.battleService.PokemonTwo.healthPoint <= 0) {
      this.StateManager.ChangeState(new State("PokemonOneWin", "None"));
      return;
    }
    p1.attack(p2);

    this.StateManager.ChangeState(
      new State(this.StateManager.CurrentState().App, 
      this.StateManager.CurrentState().Fight == "P1Attack" ? "P2Attack" : "P1Attack")
    );
  }

  private getFirstAttacker(p1: Pokemon, p2: Pokemon) {
    return p1.speed > p2.speed ? "P1Attack" : "P2Attack";
  }

  private getWinner(p1: Pokemon, p2: Pokemon) {
    const winner = p1.healthPoint > 0 ? p1 : p2;
    //state PokemonXWin
    return winner;
    
  }

}
