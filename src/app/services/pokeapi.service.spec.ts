import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PokeApiService } from './pokeapi.service';

describe('PokeApiService', () => {
  let service: PokeApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokeApiService],
    });

    service = TestBed.inject(PokeApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch pokemon names', () => {
    const dummyPokemonNames = ['bulbasaur', 'ivysaur', 'venusaur'];

    service.initializePokemonNames(3).subscribe((names) => {
      expect(names.length).toBe(3);
      expect(names).toEqual(dummyPokemonNames);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/pokemon?limit=3`);
    expect(req.request.method).toBe('GET');
    req.flush({ results: dummyPokemonNames.map((name) => ({ name })) });
  });

  it('should fetch pokemon list', () => {
    const dummyPokemonList = [
      { name: 'bulbasaur' },
      { name: 'ivysaur' },
      { name: 'venusaur' },
    ];

    service.getPokemonList(3, 0).subscribe((list) => {
      expect(list.length).toBe(3);
      expect(list).toEqual(dummyPokemonList);
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/pokemon?limit=3&offset=0`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ results: dummyPokemonList });
  });

  it('should fetch pokemon info', () => {
    const dummyPokemonInfo = { name: 'bulbasaur', id: 1 };

    service.getPokemonInfo('bulbasaur').subscribe((info) => {
      expect(info).toEqual(dummyPokemonInfo);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/pokemon/bulbasaur`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPokemonInfo);
  });

  it('should handle error when fetching pokemon names', () => {
    service.initializePokemonNames(3).subscribe((names) => {
      expect(names).toEqual([]);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/pokemon?limit=3`);
    expect(req.request.method).toBe('GET');
    req.flush('Error fetching pokemon names', {
      status: 500,
      statusText: 'Server Error',
    });
  });

  it('should handle error when fetching pokemon list', () => {
    service.getPokemonList(3, 0).subscribe((list) => {
      expect(list).toEqual([]);
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/pokemon?limit=3&offset=0`
    );
    expect(req.request.method).toBe('GET');
    req.flush('Error fetching pokemon list', {
      status: 500,
      statusText: 'Server Error',
    });
  });

  it('should handle error when fetching pokemon info', () => {
    service.getPokemonInfo('bulbasaur').subscribe((info) => {
      expect(info).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/pokemon/bulbasaur`);
    expect(req.request.method).toBe('GET');
    req.flush('Error fetching info for pokemon bulbasaur', {
      status: 500,
      statusText: 'Server Error',
    });
  });
});
