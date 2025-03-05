import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonListComponent } from './pokemon-list.component';
import { RouterModule, Routes } from '@angular/router';
import { PokemonTableComponent } from 'src/app/shared/components/pokemon-table/pokemon-table.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { PokemonDetailsModule } from '../pokemon-details/pokemon-details.module';

const routes: Routes = [{ path: '', component: PokemonListComponent }];

@NgModule({
  declarations: [PokemonListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PokemonTableComponent,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    PokemonDetailsModule,
  ],
  exports: [PokemonListComponent],
})
export class PokemonListModule {}
