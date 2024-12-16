import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ForgetpasswordPage } from './Forgetpassword.page';

import { ForgetpasswordPagePageRoutingModule } from './Forgetpassword-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ForgetpasswordPagePageRoutingModule
  ],
  declarations: [ForgetpasswordPage]
})
export class ForgetpasswordPageModule {}
