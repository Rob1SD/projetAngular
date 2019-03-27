import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../pokemon.service';
import { IPokemon } from "../../models/IPokemon";
import { fight, getWinner, Pokemon } from "../../models/class_pokemon";
import { forkJoin, of } from "rxjs";
import { flatMap, map } from 'rxjs/operators';


@Component({
    selector: 'app-pokemon-arena',
    templateUrl: './pokemon-arena.component.html',
    styleUrls: ['./pokemon-arena.component.scss']
})
export class PokemonArenaComponent implements OnInit {

    txt : string;
    pokemon1 : Pokemon;
    pokemon2 : Pokemon;
    enp : string;
    myp : string;

    constructor(public poke: PokemonService) {

      const fillAttackList = function(data){
        const max = data.moves.length;
        const min = 0;
        const posArray : number[] = [];
        for (let i = 0; i < 4; ++i){
          const randomPos = Math.floor(Math.random() * (max - min) + min);
          posArray.push(randomPos);
        }

        return data.moves.filter((val, idx) => posArray.includes(idx));
      }
      poke.GetPokemonByName("pikachu").pipe(
          map(data => {
              this.pokemon1 = new Pokemon(data);
              return fillAttackList(data);

          }),
          flatMap(dataArr => forkJoin(dataArr.map(val => poke.GetPokemonAttackUrl(val.move.url))))
      ).subscribe(attackArray => {
        this.pokemon1.setAttackList(attackArray);
        //console.log(this.pokemon1.attackList);
      });

      poke.GetPokemonByName("caterpie").pipe(
            map(data => {
                this.pokemon2 = new Pokemon(data);
                return fillAttackList(data);

            }),
            flatMap(dataArr => forkJoin(dataArr.map(val => poke.GetPokemonAttackUrl(val.move.url))))
        ).subscribe(attackArray => {
          this.pokemon2.setAttackList(attackArray);
      });

        // const unsub = forkJoin(
        //     poke.GetPokemonByName("pikachu"),
        //     poke.GetPokemonByName("caterpie")
        // ).subscribe(obsArray => {
        //     console.log(obsArray[0]);
        //     this.pokemon1 = new Pokemon(obsArray[0]);
        //     this.pokemon2 = new Pokemon(obsArray[1]);
        //
        //     unsub.unsubscribe();
        //
        // })

        this.enp = "enpimg";
        this.myp = "mypimg";
    }

    animate(){
        fight(this.pokemon1, this.pokemon2, this).then(() =>{
            const winner = getWinner(this.pokemon1, this.pokemon2, this);
            console.log('Le gagnant est ' + winner.nom);
        });
    }

    public async shake(pokemon : Pokemon) {
        const delayTime=80;
        if (pokemon===this.pokemon2){
            await (async () => { 
                for(var i = 0; i <= 3; i++){
                    this.enp = "enpimgmove";

                    await this.delay(delayTime);

                    this.enp = "enpimg";

                    await this.delay(delayTime); 
                }
            })();   
        }
        else if (pokemon === this.pokemon1) {
            await (async () => { 
                for(var i = 0; i <= 3; i++){
                    this.myp = "mypimgmove";

                    await this.delay(delayTime);

                    this.myp = "mypimg";

                    await this.delay(delayTime); 
                }
            })();
        }
    }

    public death(pokemon : Pokemon) {
        if (pokemon === this.pokemon1) {
            this.enp = "enpimgmove";
        }
        else if (pokemon === this.pokemon2) {
            this.myp = "mypimgmove";
        }
    }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    ngOnInit() {
    }

}
