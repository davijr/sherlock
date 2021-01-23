import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosOnlinePage } from './usuarios-online.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariosOnlinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosOnlinePageRoutingModule {}
