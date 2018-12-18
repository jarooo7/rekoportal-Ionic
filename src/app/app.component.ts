import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(
    private storage: Storage,
    private translateService: TranslateService,
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

    });

    if (localStorage.getItem('language')) {
      switch (localStorage.getItem('language')) {
        case 'en': {
          translateService.setDefaultLang('en');
          break;
        }
        case 'pl': {
          translateService.setDefaultLang('pl');
          break;
        }
        case 'ru': {
          translateService.setDefaultLang('ru');
          break;
        }
        case 'de': {
          translateService.setDefaultLang('de');
          break;
        }
        case 'sk': {
          translateService.setDefaultLang('sk');
          break;
        }
        case 'lt': {
          translateService.setDefaultLang('lt');
          break;
        }
        case 'fr': {
          translateService.setDefaultLang('fr');
          break;
        }
        default: {
          translateService.setDefaultLang('pl');
        }
      }
    } else {
      translateService.setDefaultLang('pl');
    }
   
  }

}
