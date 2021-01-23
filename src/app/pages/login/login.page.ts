import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, Events } from '@ionic/angular';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { GravacaoService } from 'src/app/services/gravacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('inputSenha', null) inputSenha;

  public login: string;
  public senha: string;
  public logando = false;

  constructor(private navCtrl: NavController,
              private alert: AlertController,
              private activatedRoute: ActivatedRoute,
              private autenticacao: AutenticacaoService,
              private events: Events,
              private game: GameService,
              private gravacaoService: GravacaoService) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.efetuarLoginLogout();
  }

  private efetuarLoginLogout() {
    const isLogout: boolean = this.activatedRoute.snapshot.params['logout'];
    if (isLogout) {
      this.efetuarLogout();
    } else {
      this.loginAutomatico();
    }
  }

  private efetuarLogout() {
    localStorage.setItem('usuario', null);
    localStorage.setItem('pista', null);
    localStorage.setItem('pista-equipe', null);
    this.events.publish('menu:update');
    this.autenticacao.registrarStatus(false);
    this.navCtrl.navigateRoot('login');
  }

  private loginAutomatico() {
    console.log('Efetuando login automático...');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && usuario.login && usuario.senha) {
      this.login = usuario.login;
      this.senha = usuario.senha;
      this.efetuarLogin();
    } else {
      console.log('Ocorreu um erro no login automático.');
    }
  }

  public async efetuarLogin() {
    this.logando = true;
    const usuario = {
      login: this.login,
      senha: this.senha
    };
    this.autenticacao.login(usuario).then(
      () => {
        this.events.publish('menu:update');
        this.sincronizarDadosLocais();
        this.gravacaoService.configurarLoopGravacao();
        this.navCtrl.navigateRoot('home');
        this.logando = false;
      },
      async (erro) => {
        this.logando = false;
        this.senha = null;
        const alert = await this.alert.create({
          header: 'Aviso',
          message: 'Usuário não identificado.',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

  private sincronizarDadosLocais() {
    this.game.sincronizarDados();
    //TODO  configuracao
  }

  public irParaSenha() {
    this.inputSenha.setFocus();
  }

  public mostrarSenha(isMostrar: boolean) {
    if (this.inputSenha) {
      const el = this.inputSenha.el;
      if (!isMostrar) {
        el.type = 'password';
      } else {
        el.type = 'text';
      }
      this.inputSenha.setFocus();
    }
  }

  public isMostrarSenha(): boolean {
    return this.inputSenha && this.inputSenha.el && this.inputSenha.el.type === 'text';
  }

}
