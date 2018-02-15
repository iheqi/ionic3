import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class DataProvider {

  constructor(public storage: Storage) {
    console.log('Hello DataProvider Provider');
  }
  getData(): Promise<any> {
    return this.storage.get('photos');
  }

  setData(data) {
    let newData = JSON.stringify(data);
    this.storage.set('photos',newData);
  }
}
