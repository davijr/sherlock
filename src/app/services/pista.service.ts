import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import { AppConstants } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class PistaService {

  constructor() {}

  public getTodasPistas(callback) {
    firebase.database().ref(AppConstants.URL_PISTA).orderByChild('numero').on('value', (snapshot) => {
      const pistas: any = [];
      snapshot.forEach(element => {
        pistas.push(element.val());
      });
      this.possuiNumeroDuplicado(pistas);
      callback(pistas);
    });
  }

  private possuiNumeroDuplicado(pistas) {
    if (pistas) {
      pistas.forEach(pista => {
        let itemDuplicado: any = [];
        pistas.forEach(p => {
          if ((pista.numero === p.numero || pista.codigo === p.codigo) && pista.key !== p.key && pista.ativa && p.ativa) {
            itemDuplicado.push(p);
          }
        });
        pista.numeroDuplicado = (itemDuplicado && itemDuplicado.length > 0);
      });
    }
  }

  public addPista(pista): Promise<any> {
    return new Promise((resolve, reject) => {
      if (pista) {
        const novaPista = firebase.database().ref(AppConstants.URL_PISTA).push();
        pista.key = novaPista.key;
        novaPista.set(pista).then(resolve, reject);
      } else {
        reject('Erro ao criar pista.');
      }
    });
  }

  public updatePista(pista): Promise<any> {
    return new Promise((resolve, reject) => {
      if (pista) {
        const novaPista = firebase.database().ref(AppConstants.URL_PISTA + '/' + pista.key);
        novaPista.set(pista).then(resolve, reject);
      } else {
        reject('Erro ao alterar pista.');
      }
    });
  }

  public ativarDesativarPista(pista, ativar: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      if (pista) {
        pista.ativa = ativar;
        const novaPista = firebase.database().ref(AppConstants.URL_PISTA + '/' + pista.key);
        novaPista.set(pista).then(resolve, reject);
      } else {
        reject('Erro ao ativar/desativar pista.');
      }
    });
  }

}
