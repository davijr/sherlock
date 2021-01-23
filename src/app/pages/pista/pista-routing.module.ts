import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PistaPage } from './pista.page';

const routes: Routes = [
  {
    path: '',
    component: PistaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PistaPageRoutingModule {}
