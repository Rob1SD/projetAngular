import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export type AppState = "None" | "FightStart" | "FightOngoing" | "FightPaused" | "PokemonOneWin" | "PokemonTwoWin";
export type FightState = "P1Attack" | "P2Attack" | "None";

export class State {
  public App: AppState;
  public Fight: FightState;

  constructor(app: AppState, fight: FightState) {
    this.App = app;
    this.Fight = fight;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private state: State;

  public StateClock: Observable<State>;
  
  constructor() {
    this.state = new State("None", "None");
    this.StateClock = this.intervalStateFunc();
  }

  //observer wich publish the current state of the game every seconds 
  private intervalStateFunc = () => interval(1500).pipe(
    tap(state => console.log(this.CurrentState())),
    map(() => this.CurrentState())
  );

  //return the current state 
  public CurrentState = (): State => this.state;

  //change the current state
  public ChangeState = (newState: State) => this.state = newState;
}
