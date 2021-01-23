import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PainelEquipesPageRoutingModule } from './painel-equipes-routing.module';

import { PainelEquipesPage } from './painel-equipes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PainelEquipesPageRoutingModule
  ],
  declarations: [PainelEquipesPage]
})
export class PainelEquipesPageModule {}
