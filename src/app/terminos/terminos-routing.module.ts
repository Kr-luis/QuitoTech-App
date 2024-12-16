import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { terminosPage } from './terminos.page';

const routes: Routes = [
  {
    path: '',
    component: terminosPage  // Define el componente para esta ruta
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // Configura las rutas hijas
  exports: [RouterModule]
})
export class terminosPageRoutingModule {}
