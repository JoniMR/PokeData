import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Pokemon } from '../shared/models/pokemon.interface';

@Injectable({
  providedIn: 'root',
})
export class PokeApiService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  initializePokemonNames(limit: number): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/pokemon?limit=${limit}`).pipe(
      map((response: any) =>
        response.results.map((pokemon: Pokemon) => pokemon.name)
      ),
      catchError((error) => {
        console.error('Error fetching pokemon names', error);
        return of([]);
      })
    );
  }

  getPokemonList(limit: number, offset: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`)
      .pipe(
        map((response: any) => response.results),
        catchError((error) => {
          console.error('Error fetching pokemon list', error);
          return of([]);
        })
      );
  }

  getPokemonInfo(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon/${name}`).pipe(
      catchError((error) => {
        console.error(`Error fetching info for pokemon ${name}:`, error);
        return of({});
      })
    );
  }
}
