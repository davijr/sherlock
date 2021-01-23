import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-boas-vindas',
  templateUrl: './boas-vindas.page.html',
  styleUrls: ['./boas-vindas.page.scss'],
})
export class BoasVindasPage implements OnInit {

  private deferredPrompt;

  public msg = '';

  public carregando = true;

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    // Modo Standalone
    // if (window.matchMedia('(display-mode: standalone)').matches) {
    //   this.navCtrl.navigateRoot('login/');
    // }
    this.carregando = true;
    const usuario = localStorage.getItem('usuario');
    if (usuario && usuario !== 'null') {
      this.navCtrl.navigateRoot('login/');
    } else {
      this.msg = 'Olá!<br/> Seja bem-vindo! Você pode começar a investigação quando quiser.';
    }
    this.carregando = false;
  }

  public onComecar() {
    this.navCtrl.navigateRoot('login/');
  }

  public adicionarTelaInicial() {
    // call on custom button click
    // this.customButtonClicked = true;

    // if (!this.deferredPrompt) {
    //   console.log('deferredPrompt null');
    //   return;
    // }

    // Show the prompt
    this.deferredPrompt.prompt();
    // this.deferredPromptShown = true;

    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.msg = 'Seja bem-vindo! Você pode começar a investigação quando quiser.';
        } else {
          console.log('Usuário rejeitou a instalação.');
          // this.deferredPromptRejected = true;
        }
      });
  }


}
