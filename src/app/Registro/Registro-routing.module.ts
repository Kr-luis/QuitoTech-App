import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroPage } from './Registro.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroPage  // Define el componente para esta ruta
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // Configura las rutas hijas
  exports: [RouterModule]
})
export class RegistroPageRoutingModule {}
