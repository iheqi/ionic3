import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-slideshow',
  templateUrl: 'slideshow.html',
})
export class SlideshowPage {
  photos: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController) {
    this.photos = this.navParams.get('photos');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlideshowPage');
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
}
