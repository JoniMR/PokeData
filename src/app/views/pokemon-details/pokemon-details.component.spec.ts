import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { PokeApiService } from '../../services/pokeapi.service';
import { PokemonDetailsComponent } from './pokemon-details.component';
import { STAT_RANGES } from '../../configs/constants';

describe('PokemonDetailsComponent', () => {
  let component: PokemonDetailsComponent;
  let fixture: ComponentFixture<PokemonDetailsComponent>;
  let pokeApiService: PokeApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PokemonDetailsComponent],
      imports: [HttpClientTestingModule],
      providers: [PokeApiService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonDetailsComponent);
    component = fixture.componentInstance;
    pokeApiService = TestBed.inject(PokeApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch pokemon details on init', () => {
    const mockPokemonDetails = {
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    };

    jest
      .spyOn(pokeApiService, 'getPokemonInfo')
      .mockReturnValue(of(mockPokemonDetails));
    component.pokemonName = 'bulbasaur';
    component.ngOnInit();

    expect(pokeApiService.getPokemonInfo).toHaveBeenCalledWith('bulbasaur');
    expect(component.pokemonDetails).toEqual({
      name: 'bulbasaur',
      height: 70,
      weight: 6.9,
      types: ['grass', 'poison'],
    });
  });

  it('should calculate stat percentage correctly', () => {
    const statName = 'hp';
    const statValue = 100;
    const expectedPercentage =
      ((statValue - STAT_RANGES[statName].min) /
        (STAT_RANGES[statName].max - STAT_RANGES[statName].min)) *
      100;

    const percentage = component.getStatPercentage(statName, statValue);
    expect(percentage).toBe(expectedPercentage);
  });

  it('should return 0 for invalid stat name', () => {
    const statName = 'invalidStat';
    const statValue = 100;

    const percentage = component.getStatPercentage(statName, statValue);
    expect(percentage).toBe(0);
  });

  it('should return 0 for percentage below 0', () => {
    const statName = 'hp';
    const statValue = -10;
    const expectedPercentage = 0;

    const percentage = component.getStatPercentage(statName, statValue);
    expect(percentage).toBe(expectedPercentage);
  });

  it('should return 100 for percentage above 100', () => {
    const statName = 'hp';
    const statValue = 300;
    const expectedPercentage = 100;

    const percentage = component.getStatPercentage(statName, statValue);
    expect(percentage).toBe(expectedPercentage);
  });
});
