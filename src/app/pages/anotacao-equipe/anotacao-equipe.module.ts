import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnotacaoEquipePageRoutingModule } from './anotacao-equipe-routing.module';

import { AnotacaoEquipePage } from './anotacao-equipe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnotacaoEquipePageRoutingModule
  ],
  declarations: [AnotacaoEquipePage]
})
export class AnotacaoEquipePageModule {}
