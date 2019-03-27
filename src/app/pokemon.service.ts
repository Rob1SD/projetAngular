import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPokemon } from "./models/IPokemon";

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(public http: HttpClient) {

  }

  public GetPokemonByName(name: string): Observable<IPokemon> {
    return this.http.get<IPokemon>('https://pokeapi.co/api/v2/pokemon/' + name);
  }

  public GetPokemonById(id: number): Observable<IPokemon> {
    return this.http.get<IPokemon>('https://pokeapi.co/api/v2/pokemon/' + id);
  }
   public GetPokemonAttackUrl(url : string)  {
     return this.http.get(url);
   }
}
