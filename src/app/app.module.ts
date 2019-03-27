import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { PokemonArenaComponent } from './components/pokemon-arena/pokemon-arena.component';
import { BattleMenuComponent } from './components/battle-menu/battle-menu.component';
import {MatButtonModule} from '@angular/material/button';
import { HealthBarComponent } from './components/health-bar/health-bar.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    PokemonArenaComponent,
    BattleMenuComponent,
    HealthBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    CommonModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
