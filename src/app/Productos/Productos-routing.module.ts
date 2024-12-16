import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosPage } from './Productos.page';

const routes: Routes = [
  {
    path: '',
    component: ProductosPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosPageRoutingModule {}
