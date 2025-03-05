import { Component, Input } from '@angular/core';
import { PokeApiService } from '../../services/pokeapi.service';
import { PokemonType, StatRange } from '../../shared/models/pokemon.interface';
import { STAT_RANGES } from '../../configs/constants';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss'],
})
export class PokemonDetailsComponent {
  @Input() pokemonName: string | undefined;

  pokemonDetails: any;

  constructor(private pokeApiService: PokeApiService) {}

  ngOnInit(): void {
    this.getPokemonDetails();
  }

  public getStatPercentage(statName: string, statValue: number): number {
    const statRanges: { [key: string]: StatRange } = STAT_RANGES;
    const range = statRanges[statName];
    if (!range) {
      return 0;
    }

    return this.calculatePercentage(statValue, range.min, range.max);
  }

  private calculatePercentage(value: number, min: number, max: number): number {
    const percentage = ((value - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  private getPokemonDetails(): void {
    if (this.pokemonName) {
      this.pokeApiService.getPokemonInfo(this.pokemonName).subscribe({
        next: (details: any) => {
          this.pokemonDetails = details;
          this.pokemonDetails.height = details?.height * 10;
          this.pokemonDetails.weight = details?.weight / 10;
          this.pokemonDetails.types = details?.types.map(
            (typeInfo: PokemonType) => typeInfo?.type?.name
          );
        },
      });
    }
  }
}
