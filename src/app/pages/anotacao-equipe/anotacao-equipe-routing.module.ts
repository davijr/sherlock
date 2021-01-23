import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnotacaoEquipePage } from './anotacao-equipe.page';

const routes: Routes = [
  {
    path: '',
    component: AnotacaoEquipePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnotacaoEquipePageRoutingModule {}
