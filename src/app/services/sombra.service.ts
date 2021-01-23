import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import { AppConstants } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class SombraService {

  constructor() { }

  public getTodasSombras(callback) { 
    firebase.database().ref(AppConstants.URL_USUARIO)
            .orderByChild('login').on('value', (snapshot) => {
      const sombras: any = [];
      snapshot.forEach(element => {
        const item = element.val();
        if (item.perfil === 'sombra') {
          sombras.push(element.val());
        }
      });
      this.possuiNumeroDuplicado(sombras);
      callback(sombras);
    });
  }

  private possuiNumeroDuplicado(sombras) {
    if (sombras) {
      sombras.forEach(sombra => {
        let itemDuplicado: any = [];
        sombras.forEach(e => {
          if (sombra.login === e.login && sombra.ativa && e.ativa) {
            itemDuplicado.push(e);
          }
        });
        sombra.numeroDuplicado = (itemDuplicado && itemDuplicado.length > 1);
      });
    }
  }

  public addSombra(sombra): Promise<any> {
    return new Promise((resolve, reject) => {
      if (sombra) {
        const novaSombra: any = firebase.database().ref(AppConstants.URL_USUARIO).child(sombra.login);
        novaSombra.set(sombra).then(resolve, reject);
      } else {
        reject('Erro ao criar sombra.');
      }
    });
  }

  public updateSombra(sombra): Promise<any> {
    return new Promise((resolve, reject) => {
      if (sombra) {
        const novaSombra = firebase.database().ref(AppConstants.URL_USUARIO).child(sombra.login);
        novaSombra.set(sombra).then(resolve, reject);
      } else {
        reject('Erro ao alterar sombra.');
      }
    });
  }

  public ativarDesativarSombra(sombra, ativar: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      if (sombra) {
        sombra.ativa = ativar;
        const novaSombra = firebase.database().ref(AppConstants.URL_USUARIO).child(sombra.login);
        novaSombra.set(sombra).then(resolve, reject);
      } else {
        reject('Erro ao ativar/desativar sombra.');
      }
    });
  }

  public removerSombra(sombra): Promise<any> {
    return new Promise((resolve, reject) => {
      if (sombra) {
        const novaSombra = firebase.database().ref(AppConstants.URL_USUARIO).child(sombra.login);
        novaSombra.set(null).then(resolve, reject);
      } else {
        reject('Erro ao alterar sombra.');
      }
    });
  }

}
