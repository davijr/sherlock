import { Component, OnInit } from '@angular/core';
import { SombraService } from 'src/app/services/sombra.service';
import { MensagemService } from 'src/app/services/mensagem.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-painel-sombras',
  templateUrl: './painel-sombras.page.html',
  styleUrls: ['./painel-sombras.page.scss'],
})
export class PainelSombrasPage implements OnInit {

  public sombras: any = [];
  public sombraEdicao: any = [];

  // variáveis auxiliares
  public carregandoSombras = true;

  constructor(private sombraService: SombraService,
              private mensagem: MensagemService,
              private alert: AlertController) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.listarSombras();
  }

  public listarSombras() {
    this.carregandoSombras = true;
    this.sombraService.getTodasSombras(sombras => { 
      this.sombras = sombras;
      this.carregandoSombras = false;
    });
  }

  public isEdicao(login) {
    if (login && this.sombraEdicao) {
      return this.sombraEdicao[login] && this.sombraEdicao[login].login === login ? true : false;
    }
    return false;
  }

  public iniciarEdicao(sombra) {
    sombra.novoLogin = sombra.login;
    this.sombraEdicao[sombra.login] = sombra;
  }

  public cancelarEdicao(login) {
    this.sombraEdicao[login] = {};
  }

  public alterarSombra(login) {
    // se vai mudar o login
    if (login !== this.sombraEdicao[login].novoLogin) {
      this.sombraService.removerSombra(this.sombraEdicao[login]).then(retorno => {
        this.sombraEdicao[login].login = this.sombraEdicao[login].novoLogin;
        this.sombraEdicao[login].novoLogin = null;
        this.sombraService.updateSombra(this.sombraEdicao[login]).then(ok => {
          this.cancelarEdicao(login);
          this.mensagem.toastSucesso('Sombra atualizada!');
        });
      });
    } else {
      this.sombraService.updateSombra(this.sombraEdicao[login]).then(ok => {
        this.cancelarEdicao(login);
        this.mensagem.toastSucesso('Sombra atualizada!');
      });
    }
  }

  public criarSombra() {
    const novoNumero = this.obterNovoNumero()
    const novaSombra: any = {
      login: 'sombra' + novoNumero,
      perfil: 'sombra',
      senha: 'SENHA_PADRAO',
      nome: 'Sombra ' + novoNumero,
      ativa: false
    };
    this.gerarSenha(novaSombra);
    this.sombraService.addSombra(novaSombra).then(ok => {
      this.mensagem.toastSucesso('Sombra adicionada!');
    });
  }

  private obterNovoNumero(): number {
    let maiorNumero: any = 0;
    this.sombras.forEach(e => {
      const numero = e.login.replace('sombra', '');
      const numeroAux = Number(numero);
      if (numeroAux > maiorNumero) {
        maiorNumero = numeroAux;
      }
    });
    maiorNumero += 1;
    if (maiorNumero < 10) {
      maiorNumero = '0' + maiorNumero;
    }
    return maiorNumero;
  }

  public gerarSenha(sombra) {
    const length = 8; // senha aleatório de 8 caracteres
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#.-_!';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    sombra.senha = result;
 }

  public ativarDesativar(sombra, status) {
    if (!sombra.ativa && this.possuiNumeroDuplicado(sombra)) {
      this.mensagem.toastErro('Sombra com número duplicado!');
    } else {
      this.sombraService.ativarDesativarSombra(sombra, status).then(ok => {
        if (status) {
          this.mensagem.toastSucesso('Sombra ATIVADA!');
        } else {
          this.mensagem.toastSucesso('Sombra DESATIVADA!');
        }
      });
    }
  }

  public possuiNumeroDuplicado(e) {
    const sombras = this.sombras;
    if (sombras) {
      let itemDuplicado: any = [];
      sombras.forEach(sombra => {
        if (sombra.login === e.login && sombra.ativa) {
          itemDuplicado.push(e);
        }
      });
      return (itemDuplicado && itemDuplicado.length > 1);
    }
    return false;
  }

  public async iniciarExclusao(sombra) {
    await (await this.alert.create({
      header: 'Confirmação',
      message: `Deseja remover a ${sombra.login}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            this.sombraService.removerSombra(sombra).then(retorno => {
              this.mensagem.toastSucesso('Sombra removida!');
              this.listarSombras();
            });
          }
        }
      ]
    })).present();
  }

  public removerSombra(sombra) {}

}
