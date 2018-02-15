import { LocalNotifications } from '@ionic-native/local-notifications';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, notifications: LocalNotifications) {
    platform.ready().then(() => {
      if(platform.is('cordova')){
        notifications.isScheduled(1).then((scheduled) => {
          if(!scheduled) {
            let firstNotificationTime = new Date();
            firstNotificationTime.setHours(firstNotificationTime.getHours()+24);
            notifications.schedule({
              id: 1,
              title: '每日一拍',
              text: '你今天拍照了吗?',
              at: firstNotificationTime,
              every: 'day'
            });
          }
        });
      }
    });
  }
}

