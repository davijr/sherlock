import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { EquipeService } from 'src/app/services/equipe.service';
import { MensagemService } from 'src/app/services/mensagem.service';
import { NavController } from '@ionic/angular';
import { isArray } from 'util';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';

@Component({
  selector: 'app-anotacao',
  templateUrl: './anotacao.page.html',
  styleUrls: ['./anotacao.page.scss'],
})
export class AnotacaoPage implements OnInit {

  public equipes: any = []; //TODO remover
  public dadosEquipes: any = [];

  public carregando = true;
  public contador = 0;
  public perfil = '';
  private permissoes: any = [];

  constructor(private game: GameService,
              private equipeService: EquipeService,
              private mensagem: MensagemService,
              private autenticacaoService: AutenticacaoService,
              private navCtrl: NavController,
              private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {  }

  ionViewDidEnter() {
    this.listarPermissoes();
  }

  public listarPermissoes() {
    // listar permissoes
    this.autenticacaoService.listarPermissoes().then((permissoes) => {
      this.permissoes = permissoes;
      // definir se painel será mostrado
      if (this.possuiPermissao('anotacao')) {
        this.listarEquipes();
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

  private listarEquipes() {
    this.equipeService.getTodasEquipes(retorno => {
      this.equipes = retorno;
      // this.parseEquipes(retorno);
      // this.parseDadosEquipe(retorno);
      this.carregando = false;
      // this.changeDetector.detectChanges();
    });
  }

  private parseEquipes(object) {
    if (!isArray(object)) {
      this.equipes = [];
      for (let i in object) {
        this.equipes.push(i);
      }
    }
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
          equipe: i,
          qtdPistas: qtdPistas
        });
      }
      this.dadosEquipes = this.dadosEquipes.sort((a, b) => b.qtdPistas - a.qtdPistas);
    }
  }

  private tratarErro(error) {
    console.log('Ocorreu um erro.', error);
    this.carregando = false;
  }

  public anotar() {
    // ..
  }

}
