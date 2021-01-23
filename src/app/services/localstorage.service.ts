import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {}

  public get(item: string) {
    const valor = localStorage.getItem(item);
    if (valor && valor !== 'null') {
      return JSON.parse(valor);
    }
    return null;
  }

  public set(chave: string, objeto: any) {
    const valor = JSON.stringify(objeto);
    localStorage.setItem(chave, valor);
  }

}
