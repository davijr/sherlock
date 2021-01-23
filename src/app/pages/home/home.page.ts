import { Component, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment-timezone';
import { PopoverController, NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game.service';
import { MensagemService } from 'src/app/services/mensagem.service';
import { isArray } from 'util';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { EquipeService } from 'src/app/services/equipe.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public pistas: any = [];
  public equipes: any = []; //TODO remover
  public dadosEquipes: any = [];
  private qtdPistas = null;
  public qtdUsuariosAtivos: any = '-';
  public qtdUsuariosOnline: any = '-';

  public showToolbar = false;
  public carregando = true;
  public contador = 0;
  public perfil = '';
  private permissoes: any = [];

  // relogio de pistas
  public relogio: any;
  private qtdColetas = 0;

  constructor(private popover: PopoverController,
              private game: GameService,
              private equipeService: EquipeService,
              private mensagem: MensagemService,
              private barcodeScanner: BarcodeScanner,
              private autenticacaoService: AutenticacaoService,
              private navCtrl: NavController,
              private changeDetector: ChangeDetectorRef) {
                moment.locale('pt-br');
              }

  ngOnInit() {
    moment.locale('pt-br');
  }
  
  ionViewDidEnter() {
    this.listarPermissoes();
  }

  private listarEquipes() {
    this.game.getTodasPistas().then(pistas => {
      this.qtdPistas = this.contarPistas(pistas);
      this.game.getPistasEquipes(retorno => {
        this.listarOutrasEquipes().then(() => {
          this.parseEquipes(retorno);
          this.parseDadosEquipe(retorno);
          this.carregando = false;
          this.mostrarContadores();
          this.changeDetector.detectChanges();
        }, this.tratarErro);
      });
    }, this.tratarErro);
  }

  private mostrarContadores() {
    this.autenticacaoService.contarUsuariosAtivos(usuarios => this.qtdUsuariosAtivos = usuarios.length);
    this.autenticacaoService.contarUsuariosOnline(usuarios => this.qtdUsuariosOnline = usuarios.length);
  }

  private tratarErro(error) {
    console.log('Ocorreu um erro.', error);
    this.carregando = false;
  }

  private listarOutrasEquipes(): Promise<any> {
    return new Promise(resolve => {
      this.equipeService.getTodasEquipes(equipes => {
        for (let i in equipes) {
          const equipe = equipes[i];
          if (equipe && equipe.ativa) {
            let equipeEncontrada = null;
            for (let j in this.equipes) {
              const equipeComPistas = this.equipes[j];
              if (equipeComPistas.includes(equipe.login)) {
                equipeEncontrada = equipe.login;
              }
            }
            if (equipeEncontrada) {
              this.equipes.push(equipeEncontrada);
            }
          }
        }
        resolve();
      });
    });
  }

  private contarPistas(pistas): number {
    let contador = 0;
    for (let i in pistas) {
      if (pistas[i].key) {
        contador++;
      }
    }
    return contador;
  }

  public getAvanco(equipe, formatoString) {
    if (this.qtdPistas && this.equipes && this.dadosEquipes) {
      // identificar pistas da equipe
      let qtdPistas = 0;
      this.dadosEquipes.forEach(dados => {
        if (dados.equipe === equipe) {
          qtdPistas = dados.qtdPistas;
        }
      });
      let percentual = qtdPistas / this.qtdPistas;
      if (formatoString) {
        return (percentual * 100).toFixed(2) + '%';
      }
      if (percentual > 1) {
        percentual = 1;
      }
      return percentual.toFixed(2);
    }
    return 0;
  }

  public listarPermissoes() {
    // listar permissoes
    this.autenticacaoService.listarPermissoes().then((permissoes) => {
      this.permissoes = permissoes;
      // definir qual painel será mostrado
      if (this.possuiPermissao('painel-sombra')) {
        this.listarEquipes();
      } else if (this.possuiPermissao('painel-equipe')) {
        this.listarPistas();
      }
    }, () => {
      this.carregando = false;
    });
  }

  public possuiPermissao(tela: string): boolean {
    if (this.permissoes && this.permissoes.length > 0) {
      const permissao = this.permissoes.filter(item => {
        return item === tela;
      });
      if (permissao.length > 0) {
        return true;
      }
      return false;
    }
    return false;
  }

  public scan() {
    const scanOptions = {
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      disableSuccessBeep: false,
      prompt: 'Scanner de pistas'
    };
    this.barcodeScanner.scan(scanOptions).then(barcodeData => {
      console.log("Barcode data " + JSON.stringify(barcodeData));
      this.validarPista(barcodeData.text);
    }, (err) => {
      console.log("Erro de leitura!", err);
    });
  }

  public validarPista(qrcode) {
    this.game.validarPista(qrcode).then((pista) => {
      // pista OK
      this.game.guardarPista(pista).then(() => {
        this.navCtrl.navigateForward('mensagem/', {queryParams: {tipo: 'success', mensagem: 'Parabéns!<br/>Pista '+pista.numero+' encontrada!'}});
      }, erro => {
        this.navCtrl.navigateForward('mensagem/', {queryParams: {tipo: 'danger', mensagem: 'Ops!<br/>' + erro}});
        // this.mensagem.toastErro(erro);
      });
    }, (erro) => {
      // pista NÃO OK
      this.navCtrl.navigateForward('mensagem/', {queryParams: {tipo: 'danger', mensagem: 'Ops!<br/>' + erro}});
      //this.mensagem.toastErro(erro);
    });
  }

  public onScroll($event: any) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      if (scrollTop >= 225) {
        this.showToolbar = true;
      } else {
        this.showToolbar = false;
      }
    }
  }

  private listarPistas() {
    this.game.getPistas((pistas) => {
      this.pistas = this.objectToArray(pistas);
      this.carregando = false;
    });
  }

  private objectToArray(object) {
    let array: any = [];
    if (!isArray(object)) {
      for (let i in object) {
        array.push({i : object[i]});
      }
      return array;
    } else {
      return object;
    }
  }

  private parseEquipes(object) {
    if (!isArray(object)) {
      this.equipes = [];
      for (let i in object) {
        this.equipes.push(i);
      }
    }
  }

  private getNomeEquipe(login) { // equipe01
    return 'Equipe ' + Number(login.replace('equipe', ''));
  }

  private parseDadosEquipe(object) {
    this.dadosEquipes = [];
    if (object) {
      for (let i in object) {
        let qtdPistas = 0;
        for (let j in object[i]) {
          qtdPistas++;
        }
        this.dadosEquipes.push({
          equipe: this.getNomeEquipe(i),
          qtdPistas: qtdPistas
        });
      }
      this.dadosEquipes = this.dadosEquipes.sort((a, b) => b.qtdPistas - a.qtdPistas);
    }
  }

  public getCor(valor) {
    if (valor) {
      if (valor <= .25) return 'danger';
      if (valor <= .50) return 'warning';
      if (valor <= .75) return 'tertiary';
      if (valor <= 1) return 'success';
    }
    return 'primary';
  }

  public verUsuarios(tipo) {
    if (tipo === 'ativos' && this.qtdUsuariosAtivos.length === 0) {
      return;
    }
    if (tipo === 'online' && this.qtdUsuariosOnline.length === 0) {
      return;
    }
    this.navCtrl.navigateForward('usuarios-online/', {queryParams: {tipo: tipo}});
  }

  //TODO lixo

  private getDados(): any {
    return {
      '-M0u1KtgT5GUdA_JyIBg': {
        acao: 'COLETA',
        data: 1582595399512,
        equipe: 'equipe03',
        pista: '-M0rfhPBZDmKuGiVvSjP'
      },
      '-M0u1L2VhNkMtb-yQZJZ': {
        acao: 'COLETA',
        data: 1582595401769,
        equipe: 'equipe04',
        pista: '-M0rfhPBZDmKuGiVvSjP'
      },
      '-M0u1L8OLxT0WBCgvwuK': {
        acao: 'COLETA',
        data: 1582595400549,
        equipe: 'equipe02',
        pista: '-M0rfhPBZDmKuGiVvSjP'
      },
      '-M0u1L9VcgAfwVipbPaS': {
        acao: 'COLETA',
        data: 1582595400590,
        equipe: 'equipe01',
        pista: '-M0rfhPBZDmKuGiVvSjP'
      },
      '-M0u1MQCkiyIePovucdZ': {
        acao: 'COLETA',
        data: 1582595405788,
        equipe: 'equipe06',
        pista: '-M0rfhPBZDmKuGiVvSjP'
      },
      '-M0u5Hzgwvjz77ktkbAk': {
        acao: 'COLETA',
        data: 1582596436179,
        equipe: 'equipe02',
        pista: '-M0rgD3oef_QJ5-r1V-g'
      },
      '-M0u7N0clx9LJ2Z8rFqS': {
        acao: 'COLETA',
        data: 1582596981143,
        equipe: 'equipe03',
        pista: '-M0rgD3oef_QJ5-r1V-g'
      },
      '-M0u8-GRLylJLrkMvsYl': {
        acao: 'COLETA',
        data: 1582597148718,
        equipe: 'equipe04',
        pista: '-M0rgD3oef_QJ5-r1V-g'
      },
      '-M0u89T69HDO2l71_v7h': {
        acao: 'COLETA',
        data: 1582597187678,
        equipe: 'equipe01',
        pista: '-M0rgIhnCs8ENnjmZU5A'
      },
      '-M0u8VCj5-xjPayJi6R4': {
        acao: 'COLETA',
        data: 1582597276749,
        equipe: 'equipe02',
        pista: '-M0rgIhnCs8ENnjmZU5A'
      },
      '-M0u8wz55vrBeiDhuciY': {
        acao: 'COLETA',
        data: 1582597394673,
        equipe: 'equipe03',
        pista: '-M0rgIhnCs8ENnjmZU5A'
      },
      '-M0u9Zg6IToAWHIt2348': {
        acao: 'COLETA',
        data: 1582597558662,
        equipe: 'equipe04',
        pista: '-M0rgIhnCs8ENnjmZU5A'
      },
      '-M0uA6VTMtfKdDj6bMpo': {
        acao: 'COLETA',
        data: 1582597699879,
        equipe: 'equipe06',
        pista: '-M0rgD3oef_QJ5-r1V-g'
      },
      '-M0uBiEoS5dslIvrEJzp': {
        acao: 'COLETA',
        data: 1582598120675,
        equipe: 'equipe06',
        pista: '-M0rgIhnCs8ENnjmZU5A'
      },
      '-M0uDOZmC2tgpLhgAX2p': {
        acao: 'COLETA',
        data: 1582598560334,
        equipe: 'equipe01',
        pista: '-M0rgD3oef_QJ5-r1V-g'
      },
      '-M0uDSQlM-yR8-DVEtKD': {
        acao: 'COLETA',
        data: 1582598578368,
        equipe: 'equipe04',
        pista: '-M0rgT5xXmBF6lj30r0H'
      },
      '-M0uEafe33yLPNEfllSL': {
        acao: 'COLETA',
        data: 1582598876892,
        equipe: 'equipe04',
        pista: '-M0rg_F3I4paOpfTxOFO'
      },
      '-M0uEu_-9TkXcUQFWItD': {
        acao: 'COLETA',
        data: 1582598957607,
        equipe: 'equipe02',
        pista: '-M0rgT5xXmBF6lj30r0H'
      },
      '-M0uF0VwN1dNpzY180SR': {
        acao: 'COLETA',
        data: 1582598986031,
        equipe: 'equipe06',
        pista: '-M0rg_F3I4paOpfTxOFO'
      },
      '-M0uF8Uklnk8K9efQw14': {
        acao: 'COLETA',
        data: 1582599018688,
        equipe: 'equipe01',
        pista: '-M0rjKXWCvYusWLoNAOF'
      },
      '-M0uFfkSfhmeU6zntxQS': {
        acao: 'COLETA',
        data: 1582599159036,
        equipe: 'equipe03',
        pista: '-M0rgT5xXmBF6lj30r0H'
      },
      '-M0uFpOiLruII_RZ0RvP': {
        acao: 'COLETA',
        data: 1582599199099,
        equipe: 'equipe04',
        pista: '-M0rghAsTwvWF2p85D9Q'
      },
      '-M0uFqrmsInRKZkuy6hI': {
        acao: 'COLETA',
        data: 1582599204834,
        equipe: 'equipe01',
        pista: '-M0rgT5xXmBF6lj30r0H'
      },
      '-M0uG7Ze-4nUeFcI-7-U': {
        acao: 'COLETA',
        data: 1582599277104,
        equipe: 'equipe06',
        pista: '-M0rghAsTwvWF2p85D9Q'
      },
      '-M0uGF_5Vtca4X0_rHrA': {
        acao: 'COLETA',
        data: 1582599310002,
        equipe: 'equipe02',
        pista: '-M0rg_F3I4paOpfTxOFO'
      },
      '-M0uGKl_kzIrpOfYOKU9': {
        acao: 'COLETA',
        data: 1582599331144,
        equipe: 'equipe03',
        pista: '-M0rg_F3I4paOpfTxOFO'
      },
      '-M0uGhjKg7GKGgzkAj-r': {
        acao: 'COLETA',
        data: 1582599429438,
        equipe: 'equipe02',
        pista: '-M0rghAsTwvWF2p85D9Q'
      },
      '-M0uGv3WakkHF_Zt7jgU': {
        acao: 'COLETA',
        data: 1582599483940,
        equipe: 'equipe03',
        pista: '-M0rghAsTwvWF2p85D9Q'
      },
      '-M0uH31WnTD7S4w4OqMR': {
        acao: 'COLETA',
        data: 1582599520639,
        equipe: 'equipe01',
        pista: '-M0rghAsTwvWF2p85D9Q'
      },
      '-M0uJKjkKCBaGVKHjWBR': {
        acao: 'COLETA',
        data: 1582600118314,
        equipe: 'equipe01',
        pista: '-M0rg_F3I4paOpfTxOFO'
      },
      '-M0uKSLExyDvXPL4uFDr': {
        acao: 'COLETA',
        data: 1582600410761,
        equipe: 'equipe04',
        pista: '-M0ridzdn5lQH33fcrfD'
      },
      '-M0uLFUQ8pNvbHUIaTGt': {
        acao: 'COLETA',
        data: 1582600620242,
        equipe: 'equipe04',
        pista: '-M0ripTvbQJmlPgqJ3YY'
      },
      '-M0uLzuLZeQRcqeBaHkH': {
        acao: 'COLETA',
        data: 1582600814437,
        equipe: 'equipe01',
        pista: '-M0ridzdn5lQH33fcrfD'
      },
      '-M0uMpNbJ3DFfIfCmlmf': {
        acao: 'COLETA',
        data: 1582601033486,
        equipe: 'equipe01',
        pista: '-M0ripTvbQJmlPgqJ3YY'
      },
      '-M0uMx3UdYMftxy2Ue61': {
        acao: 'COLETA',
        data: 1582601065001,
        equipe: 'equipe03',
        pista: '-M0ridzdn5lQH33fcrfD'
      },
      '-M0uO0Cw4IwCAn2qB9k6': {
        acao: 'COLETA',
        data: 1582601344133,
        equipe: 'equipe03',
        pista: '-M0ripTvbQJmlPgqJ3YY'
      },
      '-M0uO2pEm7NClboy-bGs': {
        acao: 'COLETA',
        data: 1582601354800,
        equipe: 'equipe06',
        pista: '-M0ridzdn5lQH33fcrfD'
      },
      '-M0uOSVQGpW6pdF3jn9V': {
        acao: 'COLETA',
        data: 1582601460007,
        equipe: 'equipe03',
        pista: '-M0rjKXWCvYusWLoNAOF'
      },
      '-M0uOTJCKatM2iovJZZT': {
        acao: 'COLETA',
        data: 1582601463280,
        equipe: 'equipe06',
        pista: '-M0ripTvbQJmlPgqJ3YY'
      },
      '-M0uOTOuEimulEYCDypE': {
        acao: 'COLETA',
        data: 1582601463638,
        equipe: 'equipe02',
        pista: '-M0ridzdn5lQH33fcrfD'
      },
      '-M0uOrW-vclBAqg_S0Ts': {
        acao: 'COLETA',
        data: 1582601566518,
        equipe: 'equipe01',
        pista: '-M0rivvYV74gqdCfU7jf'
      },
      '-M0uP8cHdRVnb3jerZ9a': {
        acao: 'COLETA',
        data: 1582601640687,
        equipe: 'equipe02',
        pista: '-M0ripTvbQJmlPgqJ3YY'
      },
      '-M0uPI3DF2YqRgoSYOG7': {
        acao: 'COLETA',
        data: 1582601679345,
        equipe: 'equipe06',
        pista: '-M0rgT5xXmBF6lj30r0H'
      },
      '-M0uQQVQMNcMvtJbE5Fb': {
        acao: 'COLETA',
        data: 1582601976918,
        equipe: 'equipe04',
        pista: '-M0rivvYV74gqdCfU7jf'
      },
      '-M0uRLb9WX7FBTN2Aile': {
        acao: 'COLETA',
        data: 1582602219101,
        equipe: 'equipe04',
        pista: '-M0rj5EZsk3QmeEj3lva'
      },
      '-M0uRLxkny0fPjiIjA4v': {
        acao: 'COLETA',
        data: 1582602219636,
        equipe: 'equipe06',
        pista: '-M0rivvYV74gqdCfU7jf'
      },
      '-M0uRha9IDuHONKGms1R': {
        acao: 'COLETA',
        data: 1582602311983,
        equipe: 'equipe01',
        pista: '-M0rj5EZsk3QmeEj3lva'
      },
      '-M0uRnwrNmW9F86wuFGW': {
        acao: 'COLETA',
        data: 1582602338366,
        equipe: 'equipe03',
        pista: '-M0rj5EZsk3QmeEj3lva'
      },
      '-M0uSOSTYGYnM3PGKgih': {
        acao: 'COLETA',
        data: 1582602492002,
        equipe: 'equipe03',
        pista: '-M0rivvYV74gqdCfU7jf'
      },
      '-M0uSXSKwKYzVfzHkqov': {
        acao: 'COLETA',
        data: 1582602528824,
        equipe: 'equipe02',
        pista: '-M0rivvYV74gqdCfU7jf'
      },
      '-M0uSlfveNwAfA8IkAld': {
        acao: 'COLETA',
        data: 1582602591195,
        equipe: 'equipe06',
        pista: '-M0rj5EZsk3QmeEj3lva'
      },
      '-M0uT2R9LkrDu43Ra6CA': {
        acao: 'COLETA',
        data: 1582602664964,
        equipe: 'equipe04',
        pista: '-M0rj90ui9EKsu8kYDuL'
      },
      '-M0uTFh56WEkT4b-mGuT': {
        acao: 'COLETA',
        data: 1582602718174,
        equipe: 'equipe01',
        pista: '-M0rj90ui9EKsu8kYDuL'
      },
      '-M0uTf_nfKbecZDM4rfm': {
        acao: 'COLETA',
        data: 1582602828372,
        equipe: 'equipe03',
        pista: '-M0rj90ui9EKsu8kYDuL'
      },
      '-M0uTm9ENfcJKaJ_AXL6': {
        acao: 'COLETA',
        data: 1582602855285,
        equipe: 'equipe02',
        pista: '-M0rj5EZsk3QmeEj3lva'
      },
      '-M0uULMUNHeqQi4sHMC0': {
        acao: 'COLETA',
        data: 1582603003599,
        equipe: 'equipe06',
        pista: '-M0rj90ui9EKsu8kYDuL'
      },
      '-M0uV3R1AW9MDgv7Ry5M': {
        acao: 'COLETA',
        data: 1582603192322,
        equipe: 'equipe02',
        pista: '-M0rj90ui9EKsu8kYDuL'
      },
      '-M0uVjzvqo1whaoCyry9': {
        acao: 'COLETA',
        data: 1582603370759,
        equipe: 'equipe04',
        pista: '-M0rjFLP7rUZL3USGCtc'
      },
      '-M0uVoMnqyu5AFtAP7zt': {
        acao: 'COLETA',
        data: 1582603388651,
        equipe: 'equipe01',
        pista: '-M0rjFLP7rUZL3USGCtc'
      },
      '-M0uVz1HIk8ti7TGiPID': {
        acao: 'COLETA',
        data: 1582603432309,
        equipe: 'equipe03',
        pista: '-M0rjFLP7rUZL3USGCtc'
      },
      '-M0uX2fURqxgaolx0s17': {
        acao: 'COLETA',
        data: 1582603713501,
        equipe: 'equipe06',
        pista: '-M0rjFLP7rUZL3USGCtc'
      },
      '-M0uXAJl3JnPU7HCaNEZ': {
        acao: 'COLETA',
        data: 1582603745749,
        equipe: 'equipe04',
        pista: '-M0rjKXWCvYusWLoNAOF'
      },
      '-M0uXb0BFYxU197iKNCC': {
        acao: 'COLETA',
        data: 1582603858248,
        equipe: 'equipe02',
        pista: '-M0rjFLP7rUZL3USGCtc'
      },
      '-M0uXjOI6S6_hC1FbH-8': {
        acao: 'COLETA',
        data: 1582603892717,
        equipe: 'equipe01',
        pista: '-M0rjPuSubVdkJ1F0Ozd'
      },
      '-M0uYNgIdNFW_HDl7mI2': {
        acao: 'COLETA',
        data: 1582604061684,
        equipe: 'equipe02',
        pista: '-M0rjKXWCvYusWLoNAOF'
      },
      '-M0uYe0r9VWj-_iBNo1L': {
        acao: 'COLETA',
        data: 1582604132868,
        equipe: 'equipe03',
        pista: '-M0rjPuSubVdkJ1F0Ozd'
      }/*,
      '-M0uYe5UIoa8kF-Zb_FC': {
        acao: 'COLETA',
        data: 1582604133168,
        equipe: 'equipe03',
        pista: '-M0rjPuSubVdkJ1F0Ozd'
      }*/,
      '-M0uZRvowkfxFeag7f-P': {
        acao: 'COLETA',
        data: 1582604341200,
        equipe: 'equipe02',
        pista: '-M0rjPuSubVdkJ1F0Ozd'
      },
      '-M0uZgJRR5r-mrkAHLGC': {
        acao: 'COLETA',
        data: 1582604405804,
        equipe: 'equipe04',
        pista: '-M0rjPuSubVdkJ1F0Ozd'
      },
      '-M0u_aKyJrUmvZwOPCWx': {
        acao: 'COLETA',
        data: 1582604641897,
        equipe: 'equipe06',
        pista: '-M0rjPuSubVdkJ1F0Ozd'
      },
      '-M0ucaqeg36UVe9tcFbk': {
        acao: 'COLETA',
        data: 1582605430427,
        equipe: 'equipe06',
        pista: '-M0rjKXWCvYusWLoNAOF'
      }
    };
  }

  public comecarRelogio() {
    this.game.zerarPistas();
    this.formatarDados();
  }

  private formatarDados() {
    const dados = this.getDados();
    this.game.getTodasPistas().then(retorno => {
      const pistas = retorno;    
      for (let i in dados) {
        let dado = dados[i];
        dado.hora = this.getDataFormatada(dado.data); // formatar data
        this.getNumeroPista(pistas, dado); // identificar pista
        dado.nomeEquipe = this.getNomeEquipe(dado.equipe);
      }
      // console.log('Dados formatados', dados);
      // this.formatarRelatorio(dados);
      this.mostrarRelogio(dados);
    });
  }

  private formatarRelatorio(dados) {
    let dadosRelatorio = 'equipe;';
    let listaEquipes = [];
    let listaHorarios = [];
    // cabeçalho
    for (let i in dados) {
      const dado = dados[i];
      dadosRelatorio = dadosRelatorio.concat(dado.hora + ';');
      // listar equipes
      const encontrou = listaEquipes.filter(nomeEquipe => {
        return nomeEquipe.includes(dado.equipe)
      });
      if (!encontrou || encontrou.length === 0) {
        listaEquipes.push(dado.equipe);
      }
      // listar horários
      listaHorarios.push(dado.hora);
    };
    // linhas de dados
    listaEquipes.forEach(nomeEquipe => {
      for (let i in dados) {
        const dado = dados[i];
        if (nomeEquipe.includes(dado.equipe)) {
          dadosRelatorio = dadosRelatorio.concat('\n' + dado.equipe + ';');
          dadosRelatorio = dadosRelatorio.concat(dado.numeroPista + ';');
        }
      };
    });
    // deve estar todo montado
    console.log('Dados finais do relatório:', dadosRelatorio);
    console.log('Dados finais em JSON:', JSON.stringify(dados));


    // percorre os dados, montando uma string (csv) que organize os dados da seguinte forma:
    // no cabeçalho, mostra-se.....

  }

  private mostrarRelogio(dados) {
    const intervalo = 1; // segundos
    this.relogio = moment.parseZone(dados['-M0u1KtgT5GUdA_JyIBg'].data).tz('America/Bahia').subtract(19, 'minutes'); // início
    this.gravacaoPistas(dados);
    setInterval(() => {
      if (this.qtdColetas < 70) {
        this.relogio = moment.parseZone(this.relogio).tz('America/Bahia').add(1, 'minutes');
        this.gravacaoPistas(dados);
      }
    }, 500);
  }

  private gravacaoPistas(dados) {
    for (let i in dados) {
      const coleta = dados[i];
      const horaRelogio = this.getDataFormatada(this.relogio);
      if (!coleta.incluido && coleta.hora.includes(horaRelogio)) {
        coleta.incluido = true;
        this.qtdColetas++;
        this.game.gravacaoPistas(coleta.equipe, coleta);
      }
    }
  }

  private getNumeroPista(pistas, item) {
    for (let i in pistas) {
      let pista = pistas[i];
      if (item.pista.includes(i)) {
        item.numeroPista = 'Pista ' + pista.numero;
      }
    }
  }

  public getDataFormatada(data) {
    if (data) {
      return moment.parseZone(data).tz('America/Bahia').format('h:mm');
    }
    return '';
  }

  public getRelogio() {
    if (this.relogio) {
      return moment.parseZone(this.relogio).tz('America/Bahia').format('h:mm:ss');
    }
    return '';
  }

}
