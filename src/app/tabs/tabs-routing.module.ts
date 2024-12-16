import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'Productos',
        loadChildren: () => import('../Productos/Productos.module').then(m => m.ProductosPageModule)
      },
      {
        path: 'Favoritos',
        loadChildren: () => import('../Favoritos/Favoritos.module').then(m => m.FavoritosPageModule)
      },
      {
        path: 'configuraciones',
        loadChildren: () => import('../Configuraciones/Configuraciones.module').then(m => m.ConfiguracionesPageModule)
      },
      {
        path: 'carrito',
        loadChildren: () => import('../Carrito/carrito.module').then(m => m.CarritoPageModule)
      },
      {
        path: 'ver-producto',
        loadChildren: () => import('../VerProductos/VerProductos.module').then(m => m.VerProductosPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/Productos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/Productos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
