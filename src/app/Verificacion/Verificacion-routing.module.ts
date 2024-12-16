import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerificacionPage } from './Verificacion.page';

const routes: Routes = [
  {
    path: '',
    component: VerificacionPage  // Define el componente para esta ruta
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // Configura las rutas hijas
  exports: [RouterModule]
})
export class VerificacionPageRoutingModule {}
