import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { PokeApiService } from '../../services/pokeapi.service';
import { PokemonListComponent } from './pokemon-list.component';
import { PokemonTableComponent } from '../../shared/components/pokemon-table/pokemon-table.component';
import { TABLE_CONFIG } from '../../configs/constants';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let pokeApiService: PokeApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PokemonListComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatIconModule,
        PokemonTableComponent,
      ],
      providers: [
        {
          provide: PokeApiService,
          useValue: {
            initializePokemonNames: jest
              .fn()
              .mockReturnValue(of(['bulbasaur', 'ivysaur'])),
            getPokemonList: jest.fn().mockReturnValue(of([])),
            getPokemonInfo: jest.fn().mockReturnValue(
              of({
                id: 1,
                name: 'bulbasaur',
                height: 7,
                weight: 69,
                sprites: { front_default: 'url' },
                types: [{ type: { name: 'grass' } }],
              })
            ),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    pokeApiService = TestBed.inject(PokeApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pokemon names on init', () => {
    expect(pokeApiService.initializePokemonNames).toHaveBeenCalledWith(
      TABLE_CONFIG.initialLength
    );
    expect(component.pokemonNames).toEqual(['bulbasaur', 'ivysaur']);
  });

  it('should setup search control on after view init', () => {
    jest.spyOn(component as any, 'setupSearchControl');
    component.ngAfterViewInit();
    expect((component as any).setupSearchControl).toHaveBeenCalled();
  });

  it('should apply filter when search control value changes', (done) => {
    jest.spyOn(component, 'applyFilter');
    component.ngAfterViewInit();
    component.searchControl.setValue('bulb');
    setTimeout(() => {
      expect(component.applyFilter).toHaveBeenCalledWith('bulb');
      done();
    }, 350);
  });

  it('should reset table when filter value is empty', () => {
    component.pokemonTable = {
      initializeData: jest.fn(),
    } as any;
    component.applyFilter('');
    expect(component.pokemonTable?.initializeData).toHaveBeenCalled();
  });

  it('should filter pokemon names correctly', () => {
    component.pokemonNames = ['bulbasaur', 'ivysaur', 'venusaur'];
    component.pokemonTable = {
      loadPokemonDetails: jest.fn(),
    } as any;
    component.applyFilter('bulb');
    expect(component.showTable).toBe(true);
    expect(component.pokemonTable?.loadPokemonDetails).toHaveBeenCalledWith(
      ['bulbasaur'],
      true
    );
  });

  it('should hide table when no pokemon names match filter', () => {
    component.pokemonNames = ['bulbasaur', 'ivysaur', 'venusaur'];
    component.applyFilter('xyz');
    expect(component.showTable).toBe(false);
  });

  it('should clear search and reset table', () => {
    component.pokemonTable = {
      initializeData: jest.fn(),
    } as any;
    component.clearSearch();
    expect(component.pokemonTable?.initializeData).toHaveBeenCalled();
    expect(component.searchControl.value).toBe('');
    expect(component.showTable).toBe(true);
  });

  it('should toggle search bar visibility', () => {
    component.showSearchBar = false;
    component.toggleSearchBar();
    expect(component.showSearchBar).toBe(true);
    component.toggleSearchBar();
    expect(component.showSearchBar).toBe(false);
  });

  it('should handle row click and show details', () => {
    component.showTable = true;
    component.showSearchBar = true;
    component.selectedPokemonName = null;
    component.pokemonTable = {
      rowClicked: {
        subscribe: (callback: (pokemonName: string) => void) => {
          callback('bulbasaur');
        },
      },
    } as any;

    component.ngAfterViewInit();

    expect(component.showTable).toBe(false);
    expect(component.showSearchBar).toBe(false);
    expect(component.selectedPokemonName).toBe('bulbasaur');
  });

  it('should go back to table view', () => {
    component.backToTable();
    expect(component.searchControl.value).toBe('');
    expect(component.selectedPokemonName).toBe(null);
    expect(component.showTable).toBe(true);
  });
});
