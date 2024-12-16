import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule

import { VerificacionPageRoutingModule } from './Verificacion-routing.module';
import { VerificacionPage } from './Verificacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,  // Asegúrate de tener esto
    VerificacionPageRoutingModule
  ],
  declarations: [VerificacionPage]
})
export class VerificacionPageModule {}
