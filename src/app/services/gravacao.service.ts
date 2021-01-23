import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { LocalStorageService } from './localstorage.service';
import { AppConstants } from '../app.constants';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Injectable({
  providedIn: 'root'
})
export class GravacaoService {

  public isRecording = false;
  public isGravarEquipes = false;
  public isBackground = false;

  private INTERVALO_GRAVACAO = 10; // segundos
  private volumeBackup;
  private tipoVolume = AudioManagement.VolumeType.MUSIC;

  constructor(private audioManagement: AudioManagement,
              private speechRecognition: SpeechRecognition,
              private local: LocalStorageService,
              private backgroundMode: BackgroundMode) { }
  
  private getConfiguracao() {
    firebase.database().ref(AppConstants.URL_CONFIGURACAO + '/gravarEquipes').on('value', (snapshot) => {
      this.isGravarEquipes = snapshot.val();
      console.log('isGravarEquipes: ' + this.isGravarEquipes); 
    });
    this.backgroundMode.on('enable').subscribe(() => this.isBackground = true);
    this.backgroundMode.on('disable').subscribe(() => this.isBackground = false);
  }

  public configurarLoopGravacao() {
    this.getConfiguracao();
    this.audioManagement.getVolume(this.tipoVolume).then(volume => {
      this.volumeBackup = volume;
      // solicitar permissão
      this.speechRecognition.requestPermission().then(() => {
        // Check feature available
        this.speechRecognition.isRecognitionAvailable().then(
          (available: boolean) => {
            if (available) {
              this.iniciarLoopGravacao();
            }
        });
      });
    });
  }

  private iniciarLoopGravacao() {
    this.iniciarGravacao();
    // iniciar loop de gravação
    if (this.speechRecognition.hasPermission()) {
      setInterval(() => {
        // gravar somente se a configuração permitir
        if (this.isGravarEquipes) {
          if (this.isRecording) {
            this.pararGravacao().then(() => {
              this.iniciarGravacao();
            });
          } else {
            this.iniciarGravacao();
          }
        } else {
          if (this.isRecording) {
            this.pararGravacao();
          }
        }
      }, this.INTERVALO_GRAVACAO * 1000);
    }
  }

  private pararGravacao() {
    return this.speechRecognition.stopListening();
  }

  public iniciarGravacao() {
    // verificar status configuração
    if (this.isGravarEquipes || this.isBackground) {
      if (this.isRecording) {
        this.pararGravacao();
        this.isRecording = false;
      }
    } else {
      this.isRecording = true;
      // diminui volume
      this.audioManagement.setVolume(this.tipoVolume, 0);
      let options = {
        language: 'pt-BR',
        matches: 1,
        showPopup: false
      };
      this.speechRecognition.startListening(options).subscribe((retorno) => {
        this.gravarConversas(retorno);
        this.isRecording = false;
        this.audioManagement.setVolume(this.tipoVolume, this.volumeBackup);
      });
    }
  }

  private gravarConversas(conversas) {
    if (conversas && conversas.length > 0) {
      const equipe: any = this.local.get('usuario');
      if (equipe) {
        const timestamp = firebase.database.ServerValue.TIMESTAMP;
        const ref = firebase.database()
                            .ref(`${AppConstants.URL_CONVERSA}/${equipe.login}/`)
                            .push();
        return ref.set({
          timestamp: timestamp,
          mensagem: conversas[0]
        });
      }
    }
  }

}
