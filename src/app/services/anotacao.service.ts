import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import * as moment from 'moment-timezone';
import { AppConstants } from '../app.constants';
import { AutenticacaoService } from './autenticacao.service';

@Injectable({
  providedIn: 'root'
})
export class AnotacaoService {

  constructor(private autenticacao: AutenticacaoService) {
    moment.locale('pt-br');
  }

  public listarAnotacoes(equipe, callback) {
    if (equipe) {
      firebase.database().ref(AppConstants.URL_ANOTACAO + '/' + equipe.login).orderByChild('dataCriacao').on('value', snapshot => {
        let anotacoes: any = [];
        snapshot.forEach(snapshotChild => {
          const anotacao = snapshotChild.val();
          anotacao.dataCriacaoFormatada = this.formatarData(anotacao.dataCriacao);
          anotacoes.push(anotacao);
        });
        anotacoes = this.ordenarLista(anotacoes);
        callback(anotacoes);
      });
    }
  }

  private ordenarLista(anotacoes) {
    const listaOrdenada: any = [];
    for (let i = (anotacoes.length - 1); i >= 0; i--) {
      listaOrdenada.push(anotacoes[i]);
    }
    return listaOrdenada;
  }

  public adicionarAnotacao(equipe, anotacao): Promise<any> {
    if (equipe && anotacao) {
      const ref = firebase.database().ref(AppConstants.URL_ANOTACAO + '/' + equipe.login).push();
      anotacao.equipe = equipe.login;
      anotacao.key = ref.key;
      anotacao.dataCriacao = firebase.database.ServerValue.TIMESTAMP;
      anotacao.usuarioCriacao = this.autenticacao.obterUsuarioLogado().login;
      return ref.set(anotacao);
    }
  }

  public atualizarAnotacao(equipe, anotacao) {
    if (equipe && anotacao) {
      const ref = firebase.database().ref(AppConstants.URL_ANOTACAO + '/' + equipe.login + '/' + anotacao.key);
      anotacao.dataAlteracao = firebase.database.ServerValue.TIMESTAMP;
      anotacao.usuarioAlteracao = this.autenticacao.obterUsuarioLogado().login;
      return ref.set(anotacao);
    }
  }

  public ativarEdicao(equipe, anotacao) {
    if (equipe && anotacao) {
      firebase.database().ref(AppConstants.URL_ANOTACAO + '/' + equipe.login + '/' + anotacao.key).set(anotacao);
    }
  }

  public deletarAnotacao(equipe, anotacao) {
    if (equipe && anotacao) {
      return firebase.database().ref(AppConstants.URL_ANOTACAO + '/' + equipe.login + '/' + anotacao.key).set(null);
    }
  }

  private formatarData(data) {
    if (data) {
      return moment.parseZone(data).tz('America/Bahia').fromNow();
    }
    return '';
  }

}
