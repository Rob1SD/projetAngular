import { Injectable } from '@angular/core';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { map, tap, share } from 'rxjs/operators';

export type AppState = "None" | "FightStart" | "FightOngoing" | "FightPaused" | "PokemonOneWin" | "PokemonTwoWin";
export type FightState = "P1Attack" | "P2Attack" | "None";
export type EffectState = "None" | "Shake";

export class State {
  public App: AppState;
  public Fight: FightState;
  public Effect: EffectState;

  constructor(app: AppState, fight: FightState, effectState: EffectState = "None") {
    this.App = app;
    this.Fight = fight;
    this.Effect = effectState;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private gamestate: BehaviorSubject<State> = new BehaviorSubject<State>(new State("None", "None"));

  public get CurrentState() {
    return this.gamestate.value;
  }

  public StateClock: Observable<State>;
  
  constructor() {
    this.StateClock = interval(1500).pipe(
      tap(() => console.log(this.CurrentState)),
      map(() => this.CurrentState),
      share()
    );
  }

  //change the current state
  public ChangeState = (state: State) => this.gamestate.next(state);
}
