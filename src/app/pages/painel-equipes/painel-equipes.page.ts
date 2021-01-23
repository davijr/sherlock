import { Component, OnInit } from '@angular/core';
import { EquipeService } from 'src/app/services/equipe.service';
import { MensagemService } from 'src/app/services/mensagem.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-painel-equipes',
  templateUrl: './painel-equipes.page.html',
  styleUrls: ['./painel-equipes.page.scss'],
})
export class PainelEquipesPage implements OnInit {

  public equipes: any = [];
  public equipeEdicao: any = [];

  // variáveis auxiliares
  public carregandoEquipes = true;

  constructor(private equipeService: EquipeService,
              private mensagem: MensagemService,
              private alert: AlertController) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.listarEquipes();
  }

  public listarEquipes() {
    this.carregandoEquipes = true;
    this.equipeService.getTodasEquipes(equipes => { 
      this.equipes = equipes;
      this.carregandoEquipes = false;
    });
  }

  public isEdicao(login) {
    if (login && this.equipeEdicao) {
      return this.equipeEdicao[login] && this.equipeEdicao[login].login === login ? true : false;
    }
    return false;
  }

  public iniciarEdicao(equipe) {
    equipe.novoLogin = equipe.login;
    this.equipeEdicao[equipe.login] = equipe;
  }

  public cancelarEdicao(login) {
    this.equipeEdicao[login] = {};
  }

  public alterarEquipe(login) {
    // se vai mudar o login
    if (login !== this.equipeEdicao[login].novoLogin) {
      this.equipeService.removerEquipe(this.equipeEdicao[login]).then(retorno => {
        this.equipeEdicao[login].login = this.equipeEdicao[login].novoLogin;
        this.equipeEdicao[login].novoLogin = null;
        this.equipeService.updateEquipe(this.equipeEdicao[login]).then(ok => {
          this.cancelarEdicao(login);
          this.mensagem.toastSucesso('Equipe atualizada!');
        });
      });
    } else {
      this.equipeService.updateEquipe(this.equipeEdicao[login]).then(ok => {
        this.cancelarEdicao(login);
        this.mensagem.toastSucesso('Equipe atualizada!');
      });
    }
  }

  public criarEquipe() {
    const novoNumero = this.obterNovoNumero()
    const novaEquipe: any = {
      login: 'equipe' + novoNumero,
      perfil: 'equipe',
      senha: 'SENHA_PADRAO',
      nome: 'Equipe ' + novoNumero,
      ativa: false
    };
    this.gerarSenha(novaEquipe);
    this.equipeService.addEquipe(novaEquipe).then(ok => {
      this.mensagem.toastSucesso('Equipe adicionada!');
    });
  }

  private obterNovoNumero(): number {
    let maiorNumero: any = 0;
    this.equipes.forEach(e => {
      const numero = e.login.replace('equipe', '');
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

  public gerarSenha(equipe) {
    const length = 6; // senha aleatório de 8 caracteres
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#.-_!@#.-_!@#.-_!';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    equipe.senha = result;
 }

  public ativarDesativar(equipe, status) {
    if (!equipe.ativa && this.possuiNumeroDuplicado(equipe)) {
      this.mensagem.toastErro('Equipe com número duplicado!');
    } else {
      this.equipeService.ativarDesativarEquipe(equipe, status).then(ok => {
        if (status) {
          this.mensagem.toastSucesso('Equipe ATIVADA!');
        } else {
          this.mensagem.toastSucesso('Equipe DESATIVADA!');
        }
      });
    }
  }

  public possuiNumeroDuplicado(e) {
    const equipes = this.equipes;
    if (equipes) {
      let itemDuplicado: any = [];
      equipes.forEach(equipe => {
        if (equipe.login === e.login && equipe.ativa) {
          itemDuplicado.push(e);
        }
      });
      return (itemDuplicado && itemDuplicado.length > 1);
    }
    return false;
  }

  public async iniciarExclusao(equipe) {
    await (await this.alert.create({
      header: 'Confirmação',
      message: `Deseja remover a ${equipe.login}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            this.equipeService.removerEquipe(equipe).then(retorno => {
              this.mensagem.toastSucesso('Equipe removida!');
              this.listarEquipes();
            });
          }
        }
      ]
    })).present();
  }

  public removerEquipe(equipe) {}

}
