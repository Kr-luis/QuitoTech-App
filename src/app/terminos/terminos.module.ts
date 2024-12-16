import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule

import { terminosPageRoutingModule } from './terminos-routing.module';
import { terminosPage } from './terminos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    terminosPageRoutingModule
  ],
  declarations: [terminosPage]
})
export class terminosPageModule {}
