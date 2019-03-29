import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../pokemon.service';
import { IPokemon } from "../../models/IPokemon";
import { Pokemon } from "../../models/class_pokemon";
import { forkJoin, of, Observable, Subscription } from "rxjs";
import { flatMap, map } from 'rxjs/operators';
import { compileNgModule } from '@angular/core/src/render3/jit/module';
import { BattleService } from 'src/app/battle.service';
import { GameStateService, State } from 'src/app/game-state.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-pokemon-arena',
    templateUrl: './pokemon-arena.component.html',
    styleUrls: ['./pokemon-arena.component.scss']
})
export class PokemonArenaComponent implements OnInit {

    public txt: string;
    public enp: string;
    public myp: string;
    public p1Chosen: Observable<string>;
    public p2Chosen: Observable<string>;
    private subscription : Subscription;

    constructor(public poke: PokemonService, public battleService: BattleService, 
        public statemanager: GameStateService, public activatedRoute: ActivatedRoute, public router : Router) 
    {
        this.activatedRoute.params.subscribe(x => {
            console.log(x);
            this.p1Chosen = of(x.pokemon1);
            this.p2Chosen = of(x.pokemon2);
        });
    }

    ngOnInit() {
        this.enp = "enpimg";
        this.myp = "mypimg";
        this.subscription = this.statemanager.StateClock.subscribe(state => {
            //temporaire
            const elem = document.getElementById('display');
            elem.scrollTop = elem.scrollHeight;
            if(state.Fight == "P1Attack" && this.battleService.PokemonTwo.lastDammageTaken) this.shake(this.battleService.PokemonTwo);
            if(state.Fight == "P2Attack" && this.battleService.PokemonOne.lastDammageTaken) this.shake(this.battleService.PokemonOne);
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    animate() {
        const current = this.statemanager.CurrentState;
        this.statemanager.ChangeState(new State("FightStart", current.Fight));
    }

    back() {
        this.router.navigate([`../../selection`], { relativeTo: this.activatedRoute });
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

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
