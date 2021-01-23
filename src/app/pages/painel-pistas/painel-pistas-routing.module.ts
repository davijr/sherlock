import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PainelPistasPage } from './painel-pistas.page';

const routes: Routes = [
  {
    path: '',
    component: PainelPistasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PainelPistasPageRoutingModule {}
