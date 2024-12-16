import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './Login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage  // Define el componente para esta ruta
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // Configura las rutas hijas
  exports: [RouterModule]
})
export class LoginPageRoutingModule {}
