import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PokemonArenaComponent } from './components/pokemon-arena/pokemon-arena.component';

const routes: Routes = [
    {
        path: ':pokemon1/:pokemon2',
        component: PokemonArenaComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
