import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionesPage } from './Configuraciones.page';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracionesPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionesPageRoutingModule {}
