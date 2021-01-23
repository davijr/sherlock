import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PainelPistasPageRoutingModule } from './painel-pistas-routing.module';

import { PainelPistasPage } from './painel-pistas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PainelPistasPageRoutingModule
  ],
  declarations: [PainelPistasPage]
})
export class PainelPistasPageModule {}
