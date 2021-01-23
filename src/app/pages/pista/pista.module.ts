import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PistaPageRoutingModule } from './pista-routing.module';

import { PistaPage } from './pista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PistaPageRoutingModule
  ],
  declarations: [PistaPage]
})
export class PistaPageModule {}
