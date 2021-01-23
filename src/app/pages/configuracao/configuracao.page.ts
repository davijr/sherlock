import { Component, OnInit } from '@angular/core';
import { ConfiguracaoService } from 'src/app/services/configuracao.service';
import { AlertController, ToastController } from '@ionic/angular';
import { MensagemService } from 'src/app/services/mensagem.service';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.page.html',
  styleUrls: ['./configuracao.page.scss'],
})
export class ConfiguracaoPage implements OnInit {

  public campos;

  constructor(private configuracao: ConfiguracaoService,
              private mensagem: MensagemService,
              private alert: AlertController,
              private toast: ToastController) { }

  ngOnInit() {}
  
  ionViewDidEnter() {
    this.listarCampos();
  }

  public listarCampos() {
    this.configuracao.listarCampos().then((camposRef) => {
      // atribuir campos
      camposRef.once('value').then((snapshot) => {
        this.transporListaCampos(snapshot.val());
      });
    });
  }

  /**
   * Propósito: Preencher os textareas ou inputs com o valor de cada campo.
   * Se objeto, JSON.stringfy({})
   * Se array ou número, JSON.stringfy( arrayToObject([]) ).
   * Se outro objeto, como string, somente atribui.
   * @param listaCampos 
   */
  private transporListaCampos(listaCampos) {
    this.campos = [];
    for (var key in listaCampos) {
      let campo: any = {
        nome: key
      };
      let valor = listaCampos[key];
      if (typeof valor === 'object') {
        if (Array.isArray(valor)) {
          valor = this.arrayToObject(valor);
        }
        campo.valor = JSON.stringify(valor, null, '\t');
        campo.tipo = 'objeto';
      } else {
        campo.valor = valor;
      }
      this.campos.push(campo);
    }
  }

  private arrayToObject(array) {
    let objeto = {};
    array.forEach((element, index) => {
      objeto[index] = element;
    });
    return objeto;
  }

  public async atualizarCampo(event, campo) {
    let ok = true;
    let valorJson = event.srcElement.value;
    if (campo.tipo === 'objeto') {
      if (this.validarJson(valorJson)) {
        campo.valorJson = JSON.parse(valorJson);
      } else {
        ok = false;
        this.mensagem.toastErro('Erro ao tentar salvar dados!');
      }
    } else if (campo.tipo !== 'objeto' && this.validarJson(valorJson)) {
      campo.valorJson = JSON.parse(valorJson);
    } else if (campo.tipo !== 'objeto') {
      campo.valorJson = valorJson;
    }
    if (ok) {
      this.configuracao.atualizarCampo(campo).then(() => {
        this.mensagem.toastSucesso('Atualizado com sucesso!');
        this.listarCampos();
      });
      console.log('** CAMPO ATUALIZADO **', campo);
    }
  }

  private validarJson(valor): boolean {
    try {
      JSON.parse(valor);
    } catch (e) {
      return false;
    }
    return true;
  }

  public async onAdicionarCampo() {
    const alert = await this.alert.create({
      header: 'Campo',
      inputs: [
        {
          name: 'nomeCampo',
          type: 'text',
          placeholder: 'Nome do campo'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            this.adicionarCampo(data.nomeCampo);
          }
        }
      ]
    });
    await alert.present();
  }

  private adicionarCampo(campo) {
    this.configuracao.adicionarCampo(campo).then(() => {
      this.mensagem.toastSucesso('Adicionado com sucesso!');
      this.listarCampos();
    });
  }

  public async onReset() {
    await (await this.alert.create({
      header: 'Confirmação',
      message: 'Deseja reiniciar os dados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            this.mensagem.toastSucesso('Campos reiniciados!');
            this.listarCampos();
          }
        }
      ]
    })).present();
  }

  public async onDeletarCampo(nomeCampo) {
    await (await this.alert.create({
      header: 'Confirmação',
      message: `Deseja deletar o campo <b>${nomeCampo}</b>?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            this.configuracao.deletarCampo(nomeCampo).then(async () => {
              this.mensagem.toastSucesso('mensagem');
              this.listarCampos();
            });
          }
        }
      ]
    })).present();
  }

}
