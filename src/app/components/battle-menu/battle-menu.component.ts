import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-battle-menu',
  templateUrl: './battle-menu.component.html',
  styleUrls: ['./battle-menu.component.scss']
})
export class BattleMenuComponent implements OnInit {

  public currentState: "Play" | "Pause";

  constructor() {
    this.currentState = "Play";
   }

  ngOnInit() {
  }

  changeState() {
    if(this.currentState == "Play") this.currentState = "Pause"
    else this.currentState = "Play";
  }

}
