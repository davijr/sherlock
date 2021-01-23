import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SpeechRecognition } from "@ionic-native/speech-recognition/ngx";
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

import { AppConstants } from './app.constants';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    SpeechRecognition,
    AudioManagement,
    BackgroundMode,
    SocialSharing,
    Clipboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AppConstants
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
