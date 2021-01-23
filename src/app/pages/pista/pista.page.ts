import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { MensagemService } from 'src/app/services/mensagem.service';

@Component({
  selector: 'app-pista',
  templateUrl: './pista.page.html',
  styleUrls: ['./pista.page.scss'],
})
export class PistaPage implements OnInit {

  public pista: any = {};
  public carregando = true;

  constructor(private activatedRoute: ActivatedRoute,
              private game: GameService,
              private socialSharing: SocialSharing,
              private clipboard: Clipboard,
              private mensagem: MensagemService) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.consultarPista();
  }

  private consultarPista() {
    this.carregando = true;
    const pistaKey = this.activatedRoute.snapshot.params['pistaKey'];
    this.game.getPista(pistaKey).then((pista) => {
      this.pista = pista;
      this.carregando = false;
    });
  }

  public copiar() {
    this.clipboard.copy(this.pista.link).then(
      () => this.mensagem.toastSucesso('Link da pista copiado.'),
      () => this.mensagem.toastErro('Erro ao copiar link da pista!'));
  }

  public compartilhar() {
    this.socialSharing.share(this.pista.link);
  }

}
