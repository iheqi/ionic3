import { Component } from '@angular/core';
import { NavController, ModalController, Platform, AlertController } from 'ionic-angular';
import { MyAlertProvider } from './../../providers/my-alert/my-alert';
import { DataProvider } from '../../providers/data/data'

import { PhotoModel } from './../../models/photoModel';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  photos = [];
  photoTaken;   // 今天是否已经拍照
  loaded;       // 确保加载好了
  constructor(
    public navCtrl: NavController, public myAlert: MyAlertProvider,
    public data: DataProvider, public platform: Platform, 
    public modalCtrl: ModalController, public alertCtrl: AlertController,
    public camera: Camera, public file: File
  ) { }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.loadPhotos();
    });
    // cordova 的 resume事件
    document.addEventListener('resume', () => {
      if(this.photos.length > 0) {
        let today = new Date();
        if(this.photos[0].date.setHours(0,0,0,0) === today.setHours(0,0,0,0)) {
          this.photoTaken = true;
        } else {
          this.photoTaken = false;
        }
      }
    }, false);
  } 

  loadPhotos() {
    this.data.getData().then((photos) => {
      console.log("loadPhotos:photos",photos);
      let savedPhotos: any = false;
      if(typeof(photos) != "undefined") {
        savedPhotos = JSON.parse(photos);
        console.log(savedPhotos);
      }

      if(savedPhotos) {
        savedPhotos.forEach(savedPhoto => {
          console.log("savedPhoto",savedPhoto);
          console.log("savedPhoto",savedPhoto.image);
          console.log("savedPhoto",savedPhoto.date);
          this.photos.push(new PhotoModel(savedPhoto.image,new Date(savedPhoto.date)));
        });
      }
      console.log("loadPhotos: this.loadPhotos", this.photos);
      if(this.photos[0]) {
        console.log("loadPhotos: this.photos[0]",this.photos[0]);
        console.log("loadPhotos: this.photos[0].image",this.photos[0].image);
      }

      // setHours(0,0,0,0)  零点
      if(this.photos.length > 0) {
        let today = new Date();
        if(this.photos[0].date.setHours(0,0,0,0) === today.setHours(0,0,0,0)){
          this.photoTaken = true;
        }
        this.loaded = true;
      }
    });
    this.loaded = true;
  } 
  takePhoto() {
    if(!this.loaded || this.photoTaken) {
      return false;
    } 

    const options = {
      quality: 100,
      destinationType: 1,    // 返回图片文件URI
      sourceType: 1,         // 设置图片的来源为拍摄
      encodingType: 0,       // 返回JPEG编码图像
      cameraDirection: 1,    // 前置摄像头
      saveToPhotoAlbum: true // 保存到相册
    };
    this.camera.getPicture(options).then((imagePath) => {
        console.log("imagePath",imagePath);
        // let currentName = imagePath.replace(/^.*[\\\/]/, '');
        let index = imagePath.lastIndexOf("/");
        let currentName = imagePath.substring(index+1);
        let filePath = imagePath.substring(0,index+1);

      
        let date = new Date(),
            name = date.getTime(),
            newFileName = name + ".jpg";
        
        if(this.platform.is('android')){
          console.log("这是android机");

          //将文件移到应用的永久存储文件夹
          this.file.moveFile(filePath, currentName,this.file.dataDirectory, newFileName)
            .then((success: any)=> {
              this.photoTaken = true;
              this.createPhoto(success.nativeURL);
              //console.log("存成功了。",success.nativeURL);
              //this.sharePhoto(success.nativeURL);
              console.log("this.photos",this.photos);
              console.log("this.photos[0]",this.photos[0]);
              console.log("this.photos[0].image",this.photos[0].image);

            }, (err) => {
                console.log("存失败了",err);
                let alert = this.myAlert.createAlert('哎呦喂!', '出错了。');
                alert.present();
            });
          } else {
            console.log("不是安卓机。");
            this.photoTaken = true;
            this.createPhoto(imagePath);
            //this.sharePhoto(imagePath);
          }
      },(err) => {
        console.log("拍照失败");
        let alert = this.myAlert.createAlert('哎呦喂!', '出错了。');
        alert.present();
    });
  } 
  createPhoto(photo) {
    let newPhoto = new PhotoModel(photo, new Date());
    this.photos.unshift(newPhoto);
    this.save();
  } 
  removePhoto(photo) {
    let today = new Date();
    if(photo.date.setHours(0,0,0,0) === today.setHours(0,0,0,0)){
      this.photoTaken = false;
    } 
    let index = this.photos.indexOf(photo);
    if(index > -1){
      this.photos.splice(index, 1);
      this.save();
    }
  } 
  playSlideshow() {
      if(this.photos.length > 1) {
        let modal = this.modalCtrl.create('SlideshowPage', {
          photos: this.photos
        })
        modal.present();
      } else {
      let alert = this.myAlert.createAlert('lalala...','你必须要至少2张照片哦');
      alert.present();
    }
  } 
  sharePhoto(image) {
  } 

  save() {
    this.data.setData(this.photos);
  }

}
