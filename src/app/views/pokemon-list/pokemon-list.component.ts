import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PokeApiService } from '../../services/pokeapi.service';
import { PokemonTableComponent } from '../../shared/components/pokemon-table/pokemon-table.component';
import { TABLE_CONFIG } from '../../configs/constants';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit, AfterViewInit {
  @ViewChild(PokemonTableComponent) pokemonTable?: PokemonTableComponent;

  showTable: boolean = true;
  showSearchBar: boolean = false;
  selectedPokemonName: string | null = null;
  pokemonNames: string[] = [];
  searchControl = new FormControl();

  constructor(private pokeApiService: PokeApiService) {}

  ngOnInit(): void {
    this.pokeApiService
      .initializePokemonNames(TABLE_CONFIG.initialLength)
      .subscribe((pokemonNames: string[]) => {
        this.pokemonNames = pokemonNames;
      });
  }

  ngAfterViewInit(): void {
    this.setupSearchControl();
    this.setupRowClickSubscription();
  }

  public applyFilter(filterValue: string): void {
    if (!filterValue) {
      this.resetTable();
    } else if (filterValue.length >= 3) {
      this.filterPokemonNames(filterValue);
    }
  }

  private resetTable(): void {
    this.showTable = true;
    if (this.pokemonTable) {
      this.pokemonTable.initializeData();
    }
  }

  private filterPokemonNames(filterValue: string): void {
    const filteredNames = this.pokemonNames.filter((name) =>
      name.toLowerCase().includes(filterValue.toLowerCase())
    );
    if (filteredNames.length === 0) {
      this.showTable = false;
    } else {
      this.showTable = true;
      if (this.pokemonTable) {
        this.pokemonTable?.loadPokemonDetails(filteredNames, true);
      }
    }
  }

  public clearSearch(): void {
    if (this.pokemonTable) {
      this.pokemonTable.initializeData();
    }
    this.searchControl.setValue('');
    this.showTable = true;
  }

  public toggleSearchBar(): void {
    this.showSearchBar = !this.showSearchBar;
  }

  public backToTable(): void {
    this.searchControl.setValue('');
    this.selectedPokemonName = null;
    this.showTable = true;
  }

  private setupSearchControl(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((filterValue) => {
        this.applyFilter(filterValue);
      });
  }

  private setupRowClickSubscription(): void {
    if (this.pokemonTable) {
      this.pokemonTable.rowClicked.subscribe((pokemonName: string) => {
        this.handleRowClick(pokemonName);
      });
    }
  }

  private handleRowClick(pokemonName: string): void {
    this.showTable = false;
    this.showSearchBar = false;
    this.selectedPokemonName = pokemonName;
  }
}
