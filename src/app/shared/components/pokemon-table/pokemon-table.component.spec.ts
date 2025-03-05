import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { PokeApiService } from '../../../services/pokeapi.service';
import { PokemonTableComponent } from './pokemon-table.component';
import { TABLE_CONFIG } from '../../../configs/constants';
import { Pokemon } from '../../models/pokemon.interface';

describe('PokemonTableComponent', () => {
  let component: PokemonTableComponent;
  let fixture: ComponentFixture<PokemonTableComponent>;
  let pokeApiService: PokeApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,
        BrowserAnimationsModule,
        PokemonTableComponent,
      ],
      providers: [PokeApiService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonTableComponent);
    component = fixture.componentInstance;
    pokeApiService = TestBed.inject(PokeApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data on init', () => {
    jest.spyOn(component, 'initializeData');
    component.ngOnInit();
    expect(component.initializeData).toHaveBeenCalled();
  });

  it('should load pokemon list on initializeData', () => {
    jest.spyOn<any, any>(component, 'loadPokemonList');
    component.initializeData();
    expect(component['loadPokemonList']).toHaveBeenCalledWith(
      TABLE_CONFIG.initialPageSize,
      0
    );
  });

  it('should handle page event', () => {
    jest.spyOn<any, any>(component, 'loadPokemonList');
    const event = { pageIndex: 0, pageSize: 20 } as PageEvent;
    component.handlePageEvent(event);
    expect(component.pageIndex).toBe(0);
    expect(component.pageSize).toBe(20);
    expect(component['loadPokemonList']).toHaveBeenCalledWith(20, 0);
  });

  it('should emit rowClicked event on row click', () => {
    jest.spyOn(component.rowClicked, 'emit');
    const row = { name: 'bulbasaur' } as Pokemon;
    component.onRowClicked(row);
    expect(component.rowClicked.emit).toHaveBeenCalledWith('bulbasaur');
  });

  it('should load pokemon details', () => {
    const mockPokemonDetails = [
      {
        name: 'bulbasaur',
        id: 1,
        height: 7,
        weight: 69,
        types: [{ type: { name: 'grass' } }],
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      },
      {
        name: 'ivysaur',
        id: 2,
        height: 10,
        weight: 130,
        types: [{ type: { name: 'grass' } }],
        url: 'https://pokeapi.co/api/v2/pokemon/2/',
      },
    ];

    jest
      .spyOn(pokeApiService, 'getPokemonInfo')
      .mockReturnValue(of(mockPokemonDetails[0]));
    component.loadPokemonDetails(['bulbasaur'], false);
    expect(pokeApiService.getPokemonInfo).toHaveBeenCalledWith('bulbasaur');
  });

  it('should adjust limit correctly', () => {
    component.length = 100;
    expect(component['adjustLimit'](50, 60)).toBe(40);
    expect(component['adjustLimit'](50, 40)).toBe(50);
  });

  it('should map pokemon details correctly', () => {
    const mockPokemonDetails = [
      {
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
        sprites: { front_default: 'url' },
        types: [{ type: { name: 'grass' } }],
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      },
    ];
    const mappedDetails = component['mapPokemonDetails'](mockPokemonDetails);
    expect(mappedDetails).toEqual([
      {
        id: 1,
        name: 'bulbasaur',
        height: 70,
        weight: 6.9,
        imgUrl: 'url',
        type: ['grass'],
      },
    ]);
  });

  it('should disable pagination when disablePagination is true', () => {
    const mockPokemonDetails = [
      {
        name: 'bulbasaur',
        id: 1,
        height: 7,
        weight: 69,
        types: [{ type: { name: 'grass' } }],
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      },
    ];

    jest
      .spyOn(pokeApiService, 'getPokemonInfo')
      .mockReturnValue(of(mockPokemonDetails[0]));
    component.loadPokemonDetails(['bulbasaur'], true);
    expect(component.disabled).toBe(true);
    expect(component.hasDisabledPagination).toBe(true);
    expect(component.pageSize).toBe(1);
    expect(component.pageIndex).toBe(0);
    expect(component.length).toBe(1);
  });

  it('should re-enable pagination when hasDisabledPagination is true', () => {
    const mockPokemonDetails = [
      {
        name: 'bulbasaur',
        id: 1,
        height: 7,
        weight: 69,
        types: [{ type: { name: 'grass' } }],
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      },
    ];

    component.hasDisabledPagination = true;
    jest
      .spyOn(pokeApiService, 'getPokemonInfo')
      .mockReturnValue(of(mockPokemonDetails[0]));
    jest.spyOn(component, 'initializeData');
    component.loadPokemonDetails(['bulbasaur'], false);
    expect(component.disabled).toBe(false);
    expect(component.hasDisabledPagination).toBe(false);
    expect(component.initializeData).toHaveBeenCalled();
  });

  it('should load pokemon names and details in loadPokemonList', () => {
    const mockPokemonList = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ];
    const mockPokemonDetails = [
      {
        name: 'bulbasaur',
        id: 1,
        height: 7,
        weight: 69,
        types: [{ type: { name: 'grass' } }],
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      },
      {
        name: 'ivysaur',
        id: 2,
        height: 10,
        weight: 130,
        types: [{ type: { name: 'grass' } }],
        url: 'https://pokeapi.co/api/v2/pokemon/2/',
      },
    ];

    jest
      .spyOn(pokeApiService, 'getPokemonList')
      .mockReturnValue(of(mockPokemonList));
    jest
      .spyOn(pokeApiService, 'getPokemonInfo')
      .mockReturnValue(of(mockPokemonDetails[0]));
    jest.spyOn(component, 'loadPokemonDetails');
    component['loadPokemonList'](2, 0);
    expect(pokeApiService.getPokemonList).toHaveBeenCalledWith(2, 0);
    expect(component.loadPokemonDetails).toHaveBeenCalledWith(
      ['bulbasaur', 'ivysaur'],
      false
    );
  });
});
