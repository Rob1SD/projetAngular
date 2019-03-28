import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../pokemon.service';
import { IPokemon } from "../../models/IPokemon";
import { Pokemon } from "../../models/class_pokemon";
import { forkJoin, of } from "rxjs";
import { flatMap, map } from 'rxjs/operators';
import { compileNgModule } from '@angular/core/src/render3/jit/module';
import { BattleService } from 'src/app/battle.service';
import { GameStateService, State } from 'src/app/game-state.service';


@Component({
    selector: 'app-pokemon-arena',
    templateUrl: './pokemon-arena.component.html',
    styleUrls: ['./pokemon-arena.component.scss']
})
export class PokemonArenaComponent implements OnInit {

    txt: string;
    enp: string;
    myp: string;

    constructor(public poke: PokemonService, public battleService: BattleService, public statemanager: GameStateService) {
    }

    ngOnInit() {
        this.enp = "enpimg";
        this.myp = "mypimg";
        this.statemanager.StateClock.subscribe(state => {
            //temporaire
            var elem = document.getElementById('display');
            elem.scrollTop = elem.scrollHeight;
            if(state.Fight == "P1Attack" && this.battleService.PokemonTwo.lastDammageTaken > 0) this.shake(this.battleService.PokemonTwo);
            if(state.Fight == "P2Attack" && this.battleService.PokemonOne.lastDammageTaken > 0) this.shake(this.battleService.PokemonOne);
        })
    }

    animate() {
        const current = this.statemanager.CurrentState();
        this.statemanager.ChangeState(new State("FightStart", current.Fight));
    }

    public async shake(pokemon: Pokemon) {
        const delayTime = 80;
            await (async () => {
                for (var i = 0; i <= 3; i++) {
                    if (pokemon === this.battleService.PokemonTwo) {

                        this.enp = "enpimgmove";
                        await this.delay(delayTime);
                        this.enp = "enpimg";
                        await this.delay(delayTime);

                    } else if (pokemon === this.battleService.PokemonOne) {

                        this.myp = "mypimgmove";
                        await this.delay(delayTime);
                        this.myp = "mypimg";
                        await this.delay(delayTime);

                    }
                }
            })();
    }

    public death(pokemon: Pokemon) {
        if (pokemon === this.battleService.PokemonOne) {
            this.enp = "enpimgmove";
        }
        else if (pokemon === this.battleService.PokemonTwo) {
            this.myp = "mypimgmove";
        }
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
