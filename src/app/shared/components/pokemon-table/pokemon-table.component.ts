import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TABLE_CONFIG } from '../../../configs/constants';
import { CommonModule } from '@angular/common';
import {
  Pokemon,
  PokemonDetails,
  PokemonType,
} from '../../models/pokemon.interface';
import { forkJoin } from 'rxjs';
import { PokeApiService } from '../../../services/pokeapi.service';

@Component({
  selector: 'app-pokemon-table',
  templateUrl: './pokemon-table.component.html',
  styleUrls: ['./pokemon-table.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
})
export class PokemonTableComponent implements OnInit {
  @Output() rowClicked = new EventEmitter<string>();
  dataSource = new MatTableDataSource<PokemonDetails>([]);
  isLoading: boolean = true;
  disabled: boolean = false;
  hasDisabledPagination: boolean = false;
  showFirstLastButtons: boolean = TABLE_CONFIG.showFirstLastButtons;
  length: number = TABLE_CONFIG.initialLength;
  pageSize: number = TABLE_CONFIG.initialPageSize;
  pageIndex: number = TABLE_CONFIG.initialPageIndex;
  pageSizeOptions: number[] = TABLE_CONFIG.pageSizeOptions;
  displayedColumns: string[] = TABLE_CONFIG.displayedColumns;
  skeletonData: number[] = new Array(this.pageSize);

  pageEvent: PageEvent | undefined;

  constructor(private pokeApiService: PokeApiService) {}

  ngOnInit() {
    this.initializeData();
  }

  public initializeData(): void {
    this.length = TABLE_CONFIG.initialLength;
    this.pageSize = TABLE_CONFIG.initialPageSize;
    this.pageIndex = TABLE_CONFIG.initialPageIndex;
    this.pageSizeOptions = TABLE_CONFIG.pageSizeOptions;
    this.loadPokemonList(this.pageSize, 0);
  }

  public handlePageEvent(event: PageEvent): void {
    this.pageIndex = this.pageSize === event.pageSize ? event.pageIndex : 0;
    this.pageSize = event.pageSize;
    this.loadPokemonList(this.pageSize, this.pageIndex * this.pageSize);
  }

  public onRowClicked(row: Pokemon): void {
    this.rowClicked.emit(row.name);
  }

  public loadPokemonDetails(
    pokemonNames: string[],
    disablePagination: boolean
  ): void {
    if (disablePagination) {
      this.disabled = true;
      this.hasDisabledPagination = true;
      this.length = pokemonNames.length;
      this.pageSize = pokemonNames.length;
      this.pageIndex = 0;
    } else {
      this.disabled = false;
      this.length = TABLE_CONFIG.initialLength;
      if (this.hasDisabledPagination) {
        this.hasDisabledPagination = false;
        this.initializeData();
      }
    }
    forkJoin(
      pokemonNames.map((name: string) =>
        this.pokeApiService.getPokemonInfo(name)
      )
    ).subscribe((pokemonDetails: Pokemon[]) => {
      this.dataSource.data = this.mapPokemonDetails(pokemonDetails);
      this.isLoading = false;
    });
  }

  private loadPokemonList(limit: number, offset: number): void {
    this.isLoading = true;
    limit = this.adjustLimit(limit, offset);
    this.pokeApiService.getPokemonList(limit, offset).subscribe((results) => {
      const pokemonNames: string[] = results.map(
        (pokemon: Pokemon) => pokemon.name
      );
      this.loadPokemonDetails(pokemonNames, false);
    });
  }

  private adjustLimit(limit: number, offset: number): number {
    if (offset + limit > this.length) {
      return this.length - offset;
    }
    return limit;
  }

  private mapPokemonDetails(details: Pokemon[]): PokemonDetails[] {
    return details.map((details: any) => ({
      id: details?.id,
      imgUrl: details?.sprites?.front_default,
      name: details?.name,
      type: details?.types.map((typeInfo: PokemonType) => typeInfo?.type?.name),
      height: details?.height * 10,
      weight: details?.weight / 10,
    }));
  }
}
