import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleManagerComponent } from './battle-manager.component';

describe('BattleManagerComponent', () => {
  let component: BattleManagerComponent;
  let fixture: ComponentFixture<BattleManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
