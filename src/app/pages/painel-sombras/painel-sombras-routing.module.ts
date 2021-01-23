import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PainelSombrasPage } from './painel-sombras.page';

const routes: Routes = [
  {
    path: '',
    component: PainelSombrasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PainelSombrasPageRoutingModule {}
