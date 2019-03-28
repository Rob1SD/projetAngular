import { Injectable } from '@angular/core';
import { Pokemon } from './models/class_pokemon';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  public PokemonOne: Pokemon;
  public PokemonTwo: Pokemon;

  constructor() {

  }
}
