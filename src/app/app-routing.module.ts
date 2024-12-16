import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',  // Redirecciona a la página de login por defecto
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./Login/Login.module').then(m => m.LoginPageModule)  // Carga el módulo del login
  },
  {
    path: 'registro',
    loadChildren: () => import('./Registro/Registro.module').then(m => m.RegistroPageModule)  // Carga el módulo de registro
  },
  {
    path: 'terminos',
    loadChildren: () => import('./terminos/terminos.module').then(m => m.terminosPageModule)  // Carga el módulo de registro
  },
  {
    path: 'Propietario',
    loadChildren: () => import('./Login/Login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'verificacion',
    loadChildren: () => import('./Verificacion/Verificacion.module').then(m => m.VerificacionPageModule)
  },
  {
    path: 'password',
    loadChildren: () => import('./Password/Password.module').then(m => m.PasswordPageModule)
  },
  {
    path: 'forget',
    loadChildren: () => import('./Forgetpassword/Forgetpassword.module').then(m => m.ForgetpasswordPageModule)
  },
  {
    path: 'Terminos',
    loadChildren: () => import('./Login/Login.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)  // Carga el módulo de tabs
  },
  {
    path: '**',
    redirectTo: 'login'  // Redirige a login si la ruta no existe
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
