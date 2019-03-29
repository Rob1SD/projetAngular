import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PokemonArenaComponent } from './components/pokemon-arena/pokemon-arena.component';
import { SelectionComponent } from './pages/selection/selection.component';

const routes: Routes = [
    {
        path: 'selection',
        component : SelectionComponent
    },
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
