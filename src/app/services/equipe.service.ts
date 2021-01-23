import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import { AppConstants } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

  constructor() { }

  public getTodasEquipes(callback) { 
    firebase.database().ref(AppConstants.URL_USUARIO)
            .orderByChild('login').on('value', (snapshot) => {
      const equipes: any = [];
      snapshot.forEach(element => {
        const item = element.val();
        if (item.perfil === 'equipe') {
          equipes.push(element.val());
        }
      });
      this.possuiNumeroDuplicado(equipes);
      callback(equipes);
    });
  }

  private possuiNumeroDuplicado(equipes) {
    if (equipes) {
      equipes.forEach(equipe => {
        let itemDuplicado: any = [];
        equipes.forEach(e => {
          if (equipe.login === e.login && equipe.ativa && e.ativa) {
            itemDuplicado.push(e);
          }
        });
        equipe.numeroDuplicado = (itemDuplicado && itemDuplicado.length > 1);
      });
    }
  }

  public addEquipe(equipe): Promise<any> {
    return new Promise((resolve, reject) => {
      if (equipe) {
        const novaEquipe: any = firebase.database().ref(AppConstants.URL_USUARIO).child(equipe.login);
        novaEquipe.set(equipe).then(resolve, reject);
      } else {
        reject('Erro ao criar equipe.');
      }
    });
  }

  public updateEquipe(equipe): Promise<any> {
    return new Promise((resolve, reject) => {
      if (equipe) {
        const novaEquipe = firebase.database().ref(AppConstants.URL_USUARIO).child(equipe.login);
        novaEquipe.set(equipe).then(resolve, reject);
      } else {
        reject('Erro ao alterar equipe.');
      }
    });
  }

  public ativarDesativarEquipe(equipe, ativar: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      if (equipe) {
        equipe.ativa = ativar;
        const novaEquipe = firebase.database().ref(AppConstants.URL_USUARIO).child(equipe.login);
        novaEquipe.set(equipe).then(resolve, reject);
      } else {
        reject('Erro ao ativar/desativar equipe.');
      }
    });
  }

  public removerEquipe(equipe): Promise<any> {
    return new Promise((resolve, reject) => {
      if (equipe) {
        const novaEquipe = firebase.database().ref(AppConstants.URL_USUARIO).child(equipe.login);
        novaEquipe.set(null).then(resolve, reject);
      } else {
        reject('Erro ao alterar equipe.');
      }
    });
  }

}
