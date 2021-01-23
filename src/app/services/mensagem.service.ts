import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MensagemService {

  constructor(private toast: ToastController, private alert: AlertController) {}

  public async toastSucesso(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      color: 'success',
      duration: 3000,
      buttons: ['Ok']
    });
    toast.present();
  }

  public async toastErro(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      color: 'danger',
      duration: 3000,
      buttons: ['Ok']
    });
    toast.present();
  }

  public async alerta(msg: string) {
    const alert = await this.alert.create({
      header: 'Atenção!',
      message: msg
    });
    alert.present();
  }

}
