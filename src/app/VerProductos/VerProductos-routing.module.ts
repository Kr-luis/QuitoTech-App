import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerProductosPage } from './VerProductos.component';

const routes: Routes = [
  {
    path: '',
    component: VerProductosPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerProductosPageRoutingModule {}
