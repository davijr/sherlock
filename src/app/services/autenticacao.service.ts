import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import { AppConstants } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  public usuario = null;
  public usuariosAtivos: any = [];
  public usuariosOnline: any = [];

  constructor() {}

  public loginDirecionado(usuario) {
    this.usuario = usuario;
    firebase.auth().signInAnonymously().then(() => this.atualizarStatus());
  }

  public login(usuario): Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.database().ref(`${AppConstants.URL_USUARIO}/${usuario.login}`).once('value').then((snapshot) => {
        var usuarioFB = snapshot.val();
        if (usuarioFB && usuarioFB.senha === usuario.senha && usuarioFB.ativa) {
          // guardar usuario no local storage
          localStorage.setItem('usuario', JSON.stringify(usuarioFB));
          this.usuario = usuarioFB;
          this.registrarLogin();
          this.registrarStatus(true);
          // firebase.auth().signInAnonymously().then(() => this.atualizarStatus());
          resolve(usuarioFB);
        } else {
          reject('Login e/ou senha inválido.');
        }
      }, (error) => {
        console.log('Ocorreu um erro ao tentar efetuar login.', error);
        reject('Ocorreu um erro.');
      });
    });
  }

  public obterUsuarioLogado() {
    const usuario = localStorage.getItem('usuario');
    if (usuario && usuario !== 'null') {
      return JSON.parse(usuario);
    }
    return null;
  }

  public criarUsuario(): Promise<any> {
    console.log('VAI CRIAR UM USUÁRIO');
    return firebase.database().ref('usuario').set({
      nome: 'Davi Jr.',
      email: 'teste@teste.com'
    }).then();
  }

  public listarPermissoes(): Promise<any> {
    return new Promise((resolve, reject) => {
      // obter usuario local storage
      const usuario = this.obterUsuarioLogado();
      if (usuario) {
          // obter permissao FB
          firebase.database().ref(`${AppConstants.URL_PERMISSAO}/${usuario.perfil}`).once('value').then((snapshot) => {
            resolve(snapshot.val());
          }, (error) => {reject(error); });
      } else {
        resolve([]);
      }
    });
  }

  public atualizarStatus() {
    const usuario = this.obterUsuarioLogado();
    firebase.auth().onAuthStateChanged((user) => {
      console.log('conectou 1??', user);
      console.log('conectou 2??', usuario);
      if (user) {
        // User is signed in.
        this.registrarStatus(true);
      } else {
        // No user is signed in.
        this.registrarStatus(false);
      }
    });
  }

  private registrarLogin() {
    const ref = firebase.database().ref(AppConstants.URL_HISTORICO_LOGIN).push();
    ref.set({
      data: firebase.database.ServerValue.TIMESTAMP,
      usuario: this.usuario.login
    });
  }

  public registrarStatus(isOnline) {
    console.log(`Registrar status ${isOnline ? 'online' : 'offline'}.`, this.usuario);
    if (this.usuario && !this.usuario.perfil.includes('admin')) {
      if (isOnline) {
        const ref = firebase.database().ref(AppConstants.URL_USUARIO_ONLINE + '/' + this.usuario.login);
        const usuario = {
          data: firebase.database.ServerValue.TIMESTAMP,
          usuario: this.usuario.login,
          key: ref.key
        };
        ref.set(usuario);
      } else {
        firebase.database().ref(AppConstants.URL_USUARIO_ONLINE + '/' + this.usuario.login).set(null);
      }
    }
  }

  public contarUsuariosAtivos(callback: any) {
    firebase.database().ref(AppConstants.URL_USUARIO).on('value', (snapshot) => {
      this.usuariosAtivos = [];
      snapshot.forEach(snapshotChild => {
        const usuario = snapshotChild.val();
        if (usuario && usuario.ativa && !usuario.perfil.includes('admin')) {
          this.usuariosAtivos.push(usuario);
        }
      });
      callback(this.usuariosAtivos);
    });
  }

  public contarUsuariosOnline(callback: any) {
    firebase.database().ref(AppConstants.URL_USUARIO_ONLINE).on('value', (snapshot) => {
      this.usuariosOnline = [];
      snapshot.forEach(snapshotChild => {
        const usuario = snapshotChild.val();
        if (usuario) {
          this.usuariosOnline.push(usuario);
        }
      });
      callback(this.usuariosOnline);
    });
  }

  public getQtdUsuariosAtivos() {
    if (this.usuariosAtivos) {
      return this.usuariosAtivos.length ? this.usuariosAtivos.length : '-';
    }
    return '-';
  }

  public getQtdUsuariosOnline() {
    if (this.usuariosOnline) {
      return this.usuariosOnline.length ? this.usuariosOnline.length : '-';
    }
    return '-';
  }

}
