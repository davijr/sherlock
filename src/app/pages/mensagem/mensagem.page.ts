import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-mensagem',
  templateUrl: './mensagem.page.html',
  styleUrls: ['./mensagem.page.scss'],
})
export class MensagemPage implements OnInit {

  public msg = '';
  public tipo: any = '';

  // private MSG_PISTA_ENCONTRADA = 'Parabéns!<br/>Pista encontrada!';
  // private MSG_PISTA_NAO_ENCONTRADA = 'Ops!<br/>Parece que essa não é uma pista válida!';
  private TEMPO_EXIBICAO = 4000;

  constructor(private activatedRoute: ActivatedRoute,
              private navCtrl: NavController) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.definirMensagem();
    setTimeout(() => {
      // voltar para HOME
      this.navCtrl.navigateRoot('home');
    }, this.TEMPO_EXIBICAO);
  }

  private definirMensagem() {
    this.tipo = this.activatedRoute.snapshot.queryParams['tipo'];
    this.msg = this.activatedRoute.snapshot.queryParams['mensagem'];
  }

}
