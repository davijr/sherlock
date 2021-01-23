import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import { AutenticacaoService } from './autenticacao.service';
import { LocalStorageService } from './localstorage.service';
import { AppConstants } from '../app.constants';
import { PistaPageModule } from '../pages/pista/pista.module';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private autenticacao: AutenticacaoService,
              private local: LocalStorageService) {}

  public getPista(pista): Promise<any> {
    return new Promise((resolve) => {
      // const pistasLS = this.local.get('pista-equipe');
      // if (pistasLS) {
      //   const pistaRetorno = pistasLS.filter(item => {
      //     return Number(item.numero) === Number(pista)
      //   });
      //   if (pistaRetorno.length > 0) {
      //     resolve(pistaRetorno[0]);
      //   }
      // } else {
        firebase.database().ref(AppConstants.URL_PISTA + '/' + pista).once('value').then((snapshot) => {
          const pista = snapshot.val();
          resolve(pista);
        });
      // }
    });
  }

  public getPistas(callback) {
    const equipe: any = this.autenticacao.obterUsuarioLogado();
    // const pistasLS = this.local.get('pista-equipe');
    // if (pistasLS) {
    //   resolve(pistasLS);
    // } else {
      firebase.database().ref(AppConstants.URL_PISTA_EQUIPE + '/' + equipe.login).on('value', (snapshot) => {
        let pistas: any = [];
        // obter todas as pistas
        this.getTodasPistas().then(todasPistas => {
          for (let i in todasPistas) {
            const pistaFB = todasPistas[i];
            snapshot.forEach(snapshotChild => {
              const coletaEquipe = snapshotChild.val();
              if (pistaFB && pistaFB.key === coletaEquipe.pista) {
                pistas.push(pistaFB);
              }
            });
          }
          this.local.set('pista-equipe', pistas);
          callback(pistas);
        }, erro => console.log('Erro getPistas()', erro));
      }, erro => console.log('Erro getPistas()', erro));
    // }
  }

  public getTodasPistas(): Promise<any> {
    return new Promise((resolve) => {
      // const pistasLS = this.local.get('pista');
      // if (pistasLS) {
      //   resolve(pistasLS);
      // } else {
        firebase.database().ref(AppConstants.URL_PISTA).orderByChild('ativa')
                           .equalTo(true).once('value').then((snapshot) => {
          let pistas = snapshot.val();
          // snapshot.forEach((item: any) => {
          //   if (item.ativa) {
          //     pistas.push(item);
          //   }
          // });
          this.local.set('pista', pistas);
          resolve(pistas);
        });
      // }
    });
  }

  /**
   * Propósito: Na tela de SCANNER, a equipe deve ler o QRCode referente a uma pista.
   * Ao encontrar o QRCode correto, é mostrada a tela de obtenção de item.
   * Para saber qual a pista seguinte, preciso verificar a qual roteiro essa equipe pertence.
   * Depois vejo na tabela de roteiros qual a seguinte.
   * Em seguida, vejo qual o código da pista.
   * Se o código bater, libera a pista para a equipe (adiciona na lista de pistas da equipe).
   */
  public validarPista(qrcode): Promise<any> {
    return new Promise((resolve, reject) => {
      // validar código da pista
      console.log('1- validar código da pista');
      firebase.database().ref(AppConstants.URL_PISTA).once('value').then((snapshot) => {
        let pistaEncontrada: any = null;
        snapshot.forEach(childSnapshot => {
          const pistaFB = childSnapshot.val();
          if (pistaFB && pistaFB.ativa && pistaFB.codigo === qrcode) {
            pistaEncontrada = pistaFB;
          }
        });
        if (pistaEncontrada) {
          if (!pistaEncontrada.ativa) {
            reject('Pista não foi ativada.');
          }
          console.log('PISTA ENCONTRADA!');
          resolve(pistaEncontrada);

          //TODO remover todo o resto, pois não haberá mais a regra

          /* // verificar se essa pista é a próxima da equipe
          console.log('2- verificar se essa pista é a próxima da equipe');
          let equipe: any = localStorage.getItem('usuario');
          if (equipe && equipe !== 'null') {
            equipe = JSON.parse(equipe);
            firebase.database().ref('/sherlock/usuario/' + equipe.login).once('value').then((snapshot2) => {
              equipe = snapshot2.val();
              // obter pista atual da equipe
              console.log('3- obter pista atual da equipe');
              this.getPistas().then((pistasEquipe) => {
                const ultimaPista = pistasEquipe[pistasEquipe.length - 1];
                // obter roteiro; identificar próxima pista da equipe
                console.log('4- obter roteiro; identificar próxima pista da equipe');
                firebase.database().ref('/sherlock/roteiro/' + equipe.roteiro).once('value').then((snapshot3) => {
                  const roteiro: any = snapshot3.val();
                  let numeroProximaPistaRoteiro = null;
                  // identificar posição da última pista da equipe
                  roteiro.forEach((pista, index) => {
                    if (Number(ultimaPista) === Number(pista)) {
                      numeroProximaPistaRoteiro = roteiro[index + 1];
                    }
                  });
                  // se o número da pista encontrada for igual ao da próxima pista do roteiro, OK
                  console.log('5- validar se o número da pista encontrada é igual ao da próxima pista do roteiro');
                  if (Number(numeroProximaPistaRoteiro) === Number(pistaEncontrada.numero)) {
                    console.log('PISTA ENCONTRADA!');
                    resolve(pistaEncontrada);
                  } else {
                    console.log('PISTA INVÁLIDA!');
                    reject('PISTA INVÁLIDA!');
                  }
                });
              }); // firebase /pista-equipe
            }); // firebase /usuario
            
          } // if localStorage OK */
        } else {
          console.log('PISTA INVÁLIDA!');
          reject('Código inválido!');
        }
      }, error => reject('Ocorreu um erro.<br /><small>' + error + '</small>'));
    });
  }

  public guardarPista(pista: any) {
    return new Promise((resolve, reject) => {
      console.log('1- guardar pista');
      let equipe = this.local.get('usuario');
      if (equipe) {
        // verificar qual index da nova pista
        firebase.database().ref(AppConstants.URL_PISTA_EQUIPE + '/' + equipe.login).once('value').then((snapshot) => {
          console.log('2- verificar se já possui');
          const pistasEquipe = snapshot.val();
          let pistaJaEncontrada = false;
          if (pistasEquipe) {
            for (let i in pistasEquipe) {
              const coletaEquipe = pistasEquipe[i];
              pistaJaEncontrada = coletaEquipe.pista === pista.key;
            }
          }
          if (!pistaJaEncontrada) {
            console.log('3- guardar pista nova');
            const novaPista = firebase.database().ref(AppConstants.URL_PISTA_EQUIPE + '/' + equipe.login).push();
            const coleta = {
              data: firebase.database.ServerValue.TIMESTAMP,
              pista: pista.key
            };
            novaPista.set(coleta).then(() => {
              console.log('4- pista nova guardada com sucesso');
              this.registrarColeta(equipe, pista);
              resolve();
            });
          } else {
            console.log('3- pista já guardada antes');
            reject('Essa pista já foi coletada.');
          }
        });
      } else {
        reject('Ocorreu um erro ao salvar a pista.');
      }
    });
  }

  private getObject() {}

  public getPistasEquipes(callback) {
    firebase.database().ref(AppConstants.URL_PISTA_EQUIPE).on('value', (snapshot) => {
      callback(snapshot.val());
    });
  }

  public sincronizarDados() {
    this.getTodasPistas();
    // this.getPistas();
  }

  private registrarColeta(equipe, pista) {
    const ref = firebase.database().ref(AppConstants.URL_HISTORICO_PISTA_EQUIPE).push();
    ref.set({
      data: firebase.database.ServerValue.TIMESTAMP,
      equipe: equipe.login,
      pista: pista.key,
      acao: 'COLETA'
    });
  }

  public zerarPistas() {
    firebase.database().ref(AppConstants.URL_PISTA_EQUIPE).set(null);
  }

  public gravacaoPistas(equipeLogin, coleta) {
    const novaPista = firebase.database().ref(AppConstants.URL_PISTA_EQUIPE + '/' + equipeLogin).push();
    novaPista.set(coleta);
  }

}
