import { Component, NgZone } from '@angular/core';

import { Platform, Events, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// Firebase
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { AutenticacaoService } from './services/autenticacao.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public usuario: any = {};
  public permissoes;
  public appPages: any = [];
  public carregandoPermissoes = true;
  public mostrarMenu = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private autenticacao: AutenticacaoService,
    private events: Events,
    private ngZone: NgZone,
    private navCtrl: NavController) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();
      this.configurarFirebase();
      this.listarPermissoes();
      this.iniciarVariaveis();
      this.atualizacaoMenu();
      this.verificarAutenticacao();
    });
    //TODO remover
    // this.platform.pause.subscribe(() => {
    //   console.log('this.platform.pause');
    //   this.autenticacao.registrarStatus(false);
    // });
    // this.platform.resume.subscribe(() => {
    //   console.log('this.platform.resume');
    //   this.autenticacao.registrarStatus(true);
    // });
  }

  private verificarAutenticacao() {
    // se usuário já foi gravado no LocalStorage, fazer login anônimo
    const usuario = this.autenticacao.obterUsuarioLogado();
    if (usuario && usuario.login) {
      this.autenticacao.loginDirecionado(usuario);
    } else {
      this.navCtrl.navigateRoot('login');
    }
  }

  private atualizacaoMenu() {
    this.events.subscribe('menu:update', () => {
      this.ngZone.run(() => {
        console.log('Atualização do menu lateral.');
        this.usuario = this.autenticacao.obterUsuarioLogado();
        this.listarPermissoes();
        if (this.usuario) {
          this.mostrarMenu = true;
        } else {
          this.mostrarMenu = false;
        }
      });
    });
  }

  private configurarFirebase() {
     // Firebase Configuration
     const firebaseConfig = {
      apiKey: "AIzaSyAf1ouba5hGB8trV2fw2TcAC45H6CvynXE",
      authDomain: "davijrdev.firebaseapp.com",
      databaseURL: "https://davijrdev.firebaseio.com",
      projectId: "davijrdev",
      storageBucket: "davijrdev.appspot.com",
      messagingSenderId: "514342069767",
      appId: "1:514342069767:web:dbb6790e558825d2b8eca2",
      measurementId: "G-PL90TX86NK"
    };
    firebase.initializeApp(firebaseConfig);
  }

  public atualizarPermissoes() {
    this.listarPermissoes();
  }

  private listarPermissoes() {
    // listar permissoes
    this.autenticacao.listarPermissoes().then((permissoes) => {
      this.carregandoPermissoes = false;
      this.permissoes = permissoes; 
    }, () => {
      this.carregandoPermissoes = false;
    });
  }

  private iniciarVariaveis() {
    // listar opções do Menu
    this.appPages = [
      {
        title: 'Dashboard',
        url: '/home',
        icon: 'apps',
        permitir: true
      }, {
        title: 'Banco de Dados',
        url: '/banco-dados',
        icon: 'cloud'
      }, {
        title: 'Anotações',
        url: '/anotacao',
        icon: 'document'
      }, {
        title: 'Painel Pistas',
        url: '/painel-pistas',
        icon: 'search'
      }, {
        title: 'Painel Equipes',
        url: '/painel-equipes',
        icon: 'people'
      }, {
        title: 'Painel Sombras',
        url: '/painel-sombras',
        icon: 'man'
      }, {
        title: 'Conversas',
        url: '/conversas',
        icon: 'recording'
      }, {
        title: 'Configuração',
        url: '/configuracao',
        icon: 'settings'
      }, {
        title: 'Sair',
        url: '/login',
        parametroUrl: 'logout',
        icon: 'exit',
        permitir: true
      }
    ];
  }

  public possuiPermissao(pagina: any) {
    if (this.carregandoPermissoes || !pagina) {
      return false
    }
    if (pagina.permitir) {
      return true;
    }
    if (!this.permissoes || this.permissoes.length === 0) {
      this.carregandoPermissoes = false;
      return  false;
    }
    const nomePagina = pagina.url.replace('/', '');
    const possuiPermissao = this.permissoes.filter(permissao => {
      return permissao === nomePagina;
    });
    if (possuiPermissao && possuiPermissao.length > 0) {
      return true;
    }
    return false;
  }

}
