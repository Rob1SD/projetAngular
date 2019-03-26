import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export type GameState = "NotFighting" | "FightOngoing" | "FightPaused" | "PokemonOneWin" | "PokemonTwoWin";

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private state: GameState;

  public StateClock: Observable<GameState>;
  
  constructor() {
    this.state = "NotFighting";
    this.StateClock = this.intervalStateFunc();
  }

  //observer wich publish the current state of the game every seconds 
  private intervalStateFunc = () => interval(1000).pipe(
    map(() => this.CurrentState())
  );

  //return the current state 
  public CurrentState = (): GameState => this.state;

  //change the current state
  public ChangeState = (newState: GameState) => this.state = newState;
}
