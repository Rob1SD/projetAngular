import { Component } from '@angular/core';
import { IPokemon } from "./models/IPokemon";
import {fight, getWinner, Pokemon} from './models/class_pokemon';
import {PokemonService} from './pokemon.service';
import {forkJoin} from 'rxjs';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

}
