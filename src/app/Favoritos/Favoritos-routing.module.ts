import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritosPage } from './Favoritos.page';

const routes: Routes = [
  {
    path: '',
    component: FavoritosPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavoritosPageRoutingModule {}
