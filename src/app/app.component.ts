import { Component, OnInit } from '@angular/core';

import { Platform, isPlatform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar as StatusBarNative } from '@ionic-native/status-bar/ngx';
import { Plugins, StatusBarStyle } from "@capacitor/core";
import { themeKeyValue } from './models/storage-models';
import { FcmService } from './services/fcm.service';

const { StatusBar, Storage } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  
  public Theme: IThemeType = 'light';

  constructor(
    private platform: Platform,
    private fcmService: FcmService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBarNative
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.fcmService.initPush();
    this.checkThemeAsync();
  }

  ngOnInit() {}

  async checkThemeAsync() {
    const { value } = await Storage.get({ key: themeKeyValue });
    if(value == 'null' || value == null) {
      this.Theme = "system-preference"
      await Storage.set({
        key: themeKeyValue,
        value: this.Theme,
      });
    }
    else{
      this.Theme = value as IThemeType;
    }
    this.toggleTheme();
  }

  toggleTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    if(this.Theme == 'light') {
      this.setLight();
    }
    else if(this.Theme == 'dark') {
      this.setDark();
    }
    else if(this.Theme == 'system-preference') {
      if(prefersDark.matches) {
        this.setDark();
      }
      else {
        this.setLight();
      }
    }
  }

  setLight() {
    document.body.classList.remove('dark');
    if(!isPlatform('capacitor')) return;
    StatusBar.setBackgroundColor({
      color: '#673AB7',
    });
    StatusBar.setStyle({
      style: StatusBarStyle.Light,
    });
  }

  setDark() {
    document.querySelector('body').classList.add('dark');
    if(!isPlatform('capacitor')) return;
    StatusBar.setBackgroundColor({
      color: '#323233',
    });
    StatusBar.setStyle({
      style: StatusBarStyle.Dark,
    });
  }
}

type IThemeType = "light" | "dark" | "system-preference";
