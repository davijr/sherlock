import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { NavController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {

  constructor(private game: GameService,
              private navCtrl: NavController,
              private barcodeScanner: BarcodeScanner) { }

  ngOnInit() {}

  ionViewDidEnter() {
    this.scan();
  }

  public scan() {
    const scanOptions = {
      orientation: 'landscape',
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: true,
      disableSuccessBeep: false
    };
    this.barcodeScanner.scan(scanOptions).then(barcodeData => {
      console.log("Barcode data " + JSON.stringify(barcodeData));
      this.validarPista(barcodeData.text);
    }, (err) => {
      console.log("Erro de leitura!", err);
    });
  }

  public validarPista(qrCodeTeste) {
    this.game.validarPista(qrCodeTeste).then((pista) => {
      // pista OK
      this.game.guardarPista(pista);
      this.navCtrl.navigateForward('mensagem/', {queryParams: {tipoMensagem: 'PISTA_ENCONTRADA'}});
    }, (erro) => {
      // pista NÃO OK
      this.navCtrl.navigateForward('mensagem/', {queryParams: {tipoMensagem: 'PISTA_NAO_ENCONTRADA'}});
    });
  }

}
