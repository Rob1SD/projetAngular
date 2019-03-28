import { Injectable } from '@angular/core';
import { Pokemon } from './models/class_pokemon';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  public PokemonOne: Pokemon;
  public PokemonTwo: Pokemon;

  public LoggerEmitter: BehaviorSubject<string> = new BehaviorSubject("");
  public Logger: Observable<string> = this.LoggerEmitter.pipe(
    scan((acc, cur) => acc + "<br>" + cur)
  );

  constructor() {

  }
}
