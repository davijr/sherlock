import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosOnlinePageRoutingModule } from './usuarios-online-routing.module';

import { UsuariosOnlinePage } from './usuarios-online.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosOnlinePageRoutingModule
  ],
  declarations: [UsuariosOnlinePage]
})
export class UsuariosOnlinePageModule {}
