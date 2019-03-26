import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonArenaComponent } from './pokemon-arena.component';

describe('PokemonArenaComponent', () => {
  let component: PokemonArenaComponent;
  let fixture: ComponentFixture<PokemonArenaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PokemonArenaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonArenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
