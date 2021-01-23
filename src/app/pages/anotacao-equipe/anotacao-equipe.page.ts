import { Component, OnInit, ViewChild } from '@angular/core';
import { AnotacaoService } from 'src/app/services/anotacao.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MensagemService } from 'src/app/services/mensagem.service';

@Component({
  selector: 'app-anotacao-equipe',
  templateUrl: './anotacao-equipe.page.html',
  styleUrls: ['./anotacao-equipe.page.scss'],
})
export class AnotacaoEquipePage implements OnInit {
  @ViewChild('anotacaoTexto', {static: false}) anotacaoTexto: any;

  public anotacoes: any = [];
  private anotacoesEdicao: any = [];
  public equipe: any = {};

  public carregando = true;

  constructor(private anotacaoService: AnotacaoService,
              private activatedRoute: ActivatedRoute,
              private mensagem: MensagemService,
              private alert: AlertController) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.listarAnotacoes();
  }

  private listarAnotacoes() {
    this.carregando = true;
    this.equipe.login = this.activatedRoute.snapshot.params['equipe'];
    this.anotacaoService.listarAnotacoes(this.equipe, anotacoes => {
      this.anotacoes = anotacoes;
      this.guardarItensEdicao();
      this.carregando = false;
    });
  }

  private guardarItensEdicao() {
    this.anotacoes.forEach(item => {
      if (item.edicao) {
        this.anotacoesEdicao[item.key] = {
          titulo: item.titulo,
          texto: item.texto
        };
      }
    });
  }

  public adicionarAnotacao() {
    const anotacao: any = {edicao: true};
    this.anotacaoService.adicionarAnotacao(this.equipe, anotacao).then(() => {
      this.mensagem.toastSucesso('Anotação adicionada.');
    }, this.tratarErro);
  }

  public atualizarAnotacao(anotacao: any) {
    anotacao.edicao = false;
    this.anotacaoService.atualizarAnotacao(this.equipe, anotacao).then(() => {
      this.mensagem.toastSucesso('Anotação atualizada.');
    }, this.tratarErro);
  }

  public ativarEdicao(anotacao, ativarDesativar) {
    if (ativarDesativar) {
      this.anotacoesEdicao[anotacao.key] = {
        titulo: anotacao.titulo,
        texto: anotacao.texto
      };
    } else if (this.anotacoesEdicao[anotacao.key]) {
      anotacao.titulo = this.anotacoesEdicao[anotacao.key].titulo;
      anotacao.texto = this.anotacoesEdicao[anotacao.key].texto;
      this.anotacoesEdicao[anotacao.key] = null;
    }
    anotacao.edicao = ativarDesativar;
    this.anotacaoService.ativarEdicao(this.equipe, anotacao);
  }

  public async onDeletarAnotacao(anotacao) {
    const titulo = anotacao.titulo ? ' <b>' + anotacao.titulo + '</b>' : '';
    await (await this.alert.create({
      header: 'Confirmação',
      message: 'Deseja excluir a anotação' + titulo + '?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            this.anotacaoService.deletarAnotacao(this.equipe, anotacao).then(async () => {
              this.mensagem.toastSucesso('Anotação excluída.');
              this.listarAnotacoes();
            }, this.tratarErro);
          }
        }
      ]
    })).present();
  }

  public proximoCampo() {
    this.anotacaoTexto.setFocus();
  }

  private tratarErro(error) {
    console.log('Ocorreu um erro.', error);
    this.mensagem.toastErro('Ocorreu um erro!');
    this.carregando = false;
  }

}
