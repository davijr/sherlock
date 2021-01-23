import { Component, OnInit } from '@angular/core';
import { PistaService } from 'src/app/services/pista.service';
import { MensagemService } from 'src/app/services/mensagem.service';

@Component({
  selector: 'app-painel-pistas',
  templateUrl: './painel-pistas.page.html',
  styleUrls: ['./painel-pistas.page.scss'],
})
export class PainelPistasPage implements OnInit {

  public pistas: any = [];
  public pistaEdicao: any = [];

  // variáveis auxiliares
  public carregandoPistas = true;

  constructor(private pistaService: PistaService,
              private mensagem: MensagemService) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.listarPistas();
  }

  public listarPistas() {
    this.pistaService.getTodasPistas(pistas => {
      this.pistas = pistas;
      this.carregandoPistas = false;
    });
  }

  public isEdicao(key) {
    if (key && this.pistaEdicao) {
      return this.pistaEdicao[key] && this.pistaEdicao[key].key === key ? true : false;
    }
    return false;
  }

  public iniciarEdicao(pista) {
    this.pistaEdicao[pista.key] = pista;
  }

  public cancelarEdicao(key) {
    this.pistaEdicao[key] = {};
  }

  public alterarPista(key) {
    const pista = this.pistaEdicao[key];
    this.verificarLink(pista);
    this.pistaService.updatePista(pista).then(ok => {
      this.cancelarEdicao(key);
      this.mensagem.toastSucesso('Pista atualizada!');
    });
  }

  private verificarLink(pista) {
    if (pista && pista.link) {
      if (pista.link.indexOf('http') <= 0  && pista.link.indexOf('https') <= 0) {
        pista.link = 'http://' + pista.link;
      }
    }
  }

  public criarPista() {
    const novaPista: any = {
      numero: "00",
      nome: 'PISTA NOVA',
      codigo: 'CODIGO_PADRAO',
      ativa: false
    };
    this.gerarCodigo(novaPista);
    this.pistaService.addPista(novaPista).then(ok => {
      this.mensagem.toastSucesso('Pista adicionada!');
    });
  }

  public ativarDesativar(pista, status) {
    if (!pista.ativa && this.possuiNumeroDuplicado(pista)) {
      this.mensagem.toastErro('Pista com número duplicado!');
    } else {
      this.pistaService.ativarDesativarPista(pista, status).then(ok => {
        if (status) {
          this.mensagem.toastSucesso('Pista ATIVADA!');
        } else {
          this.mensagem.toastSucesso('Pista DESATIVADA!');
        }
      });
    }
  }

  public possuiNumeroDuplicado(p) {
    const pistas = this.pistas;
    if (pistas) {
      let itemDuplicado: any = [];
      pistas.forEach(pista => {
        if ((pista.numero === p.numero || pista.codigo === p.codigo) && pista.key !== p.key && pista.ativa) {
          itemDuplicado.push(p);
        }
      });
      return (itemDuplicado && itemDuplicado.length > 0);
    }
    return false;
  }

  public gerarCodigo(pista) {
    const length = 10; // senha aleatório de 8 caracteres
    let result = '';
    const characters = '_-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    pista.codigo = result;
 }

  public removerPista(pista) {}

}
