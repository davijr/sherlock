import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BancoDadosPageRoutingModule } from './banco-dados-routing.module';

import { BancoDadosPage } from './banco-dados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BancoDadosPageRoutingModule
  ],
  declarations: [BancoDadosPage]
})
export class BancoDadosPageModule {}
