import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonDetailsComponent } from './pokemon-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [PokemonDetailsComponent],
  imports: [CommonModule, MatTooltipModule],
  exports: [PokemonDetailsComponent],
})
export class PokemonDetailsModule {}
