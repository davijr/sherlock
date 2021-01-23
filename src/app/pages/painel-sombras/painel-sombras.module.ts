import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PainelSombrasPageRoutingModule } from './painel-sombras-routing.module';

import { PainelSombrasPage } from './painel-sombras.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PainelSombrasPageRoutingModule
  ],
  declarations: [PainelSombrasPage]
})
export class PainelSombrasPageModule {}
