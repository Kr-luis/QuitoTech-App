import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ConfiguracionesPage } from './Configuraciones.page';

import { ConfiguracionesPageRoutingModule } from './Configuraciones-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ConfiguracionesPageRoutingModule
  ],
  declarations: [ConfiguracionesPage]
})
export class ConfiguracionesPageModule {}
