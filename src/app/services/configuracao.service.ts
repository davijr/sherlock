import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import { AppConstants } from '../app.constants';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoService {

  constructor(private local: LocalStorageService) { }

  public listarCampos(): Promise<any> {
    return new Promise((resolve) => {
      resolve(firebase.database().ref(AppConstants.URL_BASE_FIREBASE));
      
      /*.on('value', (snapshot) => {
        resolve(snapshot);

        /*snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key; // caso precise do nome do campo
          this.campos.push(child);
        });* /

      });*/
    });
  }

  public atualizarCampo(campo) {
    return firebase.database().ref(AppConstants.URL_BASE_FIREBASE + '/' + campo.nome).set(campo.valorJson);
  }

  public adicionarCampo(campo) {
    return firebase.database().ref(AppConstants.URL_BASE_FIREBASE + '/' + campo).set("");
  }

  public deletarCampo(campo) {
    return firebase.database().ref(AppConstants.URL_BASE_FIREBASE + '/' + campo).set({});
  }

}
