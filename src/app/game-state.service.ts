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

  private intervalStateFunc = () => interval(1000).pipe(
    map(() => this.CurrentState())
  );

  public CurrentState = (): GameState => this.state;

  public ChangeState = (newState: GameState) => this.state = newState;
}
