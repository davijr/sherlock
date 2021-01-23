import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PainelEquipesPage } from './painel-equipes.page';

const routes: Routes = [
  {
    path: '',
    component: PainelEquipesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PainelEquipesPageRoutingModule {}
