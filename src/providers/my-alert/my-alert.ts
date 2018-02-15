import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
@Injectable()
export class MyAlertProvider {

  constructor(public alertCtrl: AlertController) {
    console.log('Hello MyAlertProvider Provider');
  }

  createAlert(title: string, message: string): any {
    return this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: '确定'
      }]
    });
  }
}
