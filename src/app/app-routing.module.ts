import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pokemon-list',
    pathMatch: 'full',
  },
  {
    path: 'pokemon-list',
    loadChildren: () =>
      import('./views/pokemon-list/pokemon-list.module').then(
        (m) => m.PokemonListModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
