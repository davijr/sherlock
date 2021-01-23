import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-usuarios-online',
  templateUrl: './usuarios-online.page.html',
  styleUrls: ['./usuarios-online.page.scss'],
})
export class UsuariosOnlinePage implements OnInit {

  public usuarios: any = [];
  public tipo = '';
  public carregando =  true;

  constructor(private activatedRoute: ActivatedRoute,
              private autenticacao: AutenticacaoService) { }

  ngOnInit() {
    moment.locale('pt-br');
  }

  ionViewDidEnter() {
    this.listarUsuarios();
  }

  private listarUsuarios() {
    this.carregando = true;
    this.tipo = this.activatedRoute.snapshot.queryParams['tipo'];
    if (this.tipo === 'ativos') {
      this.autenticacao.contarUsuariosAtivos(usuarios => {
        this.usuarios = usuarios;
        this.carregando = false;
      });
    } else if (this.tipo === 'online') {
      this.autenticacao.contarUsuariosOnline(usuarios => {
        this.usuarios = usuarios;
        this.carregando = false;
      });
    }
  }

  public getDataFormatada(data) {
    if (data) {
      return moment.parseZone(data).tz('America/Bahia').fromNow();
    }
    return '';
  }

}
