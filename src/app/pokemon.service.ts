import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(public http: HttpClient) {

  }

  public GetPokemonByName(name: string) {
    return this.http.get<IPokemon>('https://pokeapi.co/api/v2/pokemon/' + name);
  }
}
