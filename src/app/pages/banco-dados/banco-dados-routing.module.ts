import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BancoDadosPage } from './banco-dados.page';

const routes: Routes = [
  {
    path: '',
    component: BancoDadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BancoDadosPageRoutingModule {}
