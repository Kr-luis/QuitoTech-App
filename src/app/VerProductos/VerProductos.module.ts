import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { VerProductosPage } from './VerProductos.component';

import { VerProductosPageRoutingModule } from './VerProductos-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    VerProductosPageRoutingModule
  ],
  declarations: [VerProductosPage]
})
export class VerProductosPageModule {}
