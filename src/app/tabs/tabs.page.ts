import { MyserviceService } from './../myservice.service';
import { Http } from '@angular/http';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { Platform, NavController, MenuController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  isLogin = false;nama;user;
  bahasa;bahasa_name;
  menu1;menu2;menu3;menu4;menu5;
  message_confirm_logout;

  tabIndex = 1;

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private platform: Platform,
    private storage: StorageMap,
    private statusBar: StatusBar,
    private route: ActivatedRoute,
    private serv: MyserviceService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private splashScreen: SplashScreen,
    private alertController: AlertController
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
    this.storage.get('bahasa').subscribe((data) => {
      if(data){
        this.bahasa = data;
        this.storage.get('bahasa_name').subscribe((data) => {
          if(data){
            this.bahasa_name = data;
            this.getSubtitle();
          }
        });
      }
    });
  }
  OnInit(){
    this.getSubtitle();
    this.cekLogin();
  }
  ionViewWillEnter(){
    this.getSubtitle();
    this.cekLogin();
  }
  getSubtitle(){
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      var response = data.json();
      if(this.bahasa=="id"){
        this.message_confirm_logout      = response.id.message_confirm_logout;
        this.menu1      = response.id.menu1;
        this.menu2      = response.id.menu2;
        this.menu3      = response.id.menu3;
        this.menu4      = response.id.menu4;
        this.menu5      = response.id.menu5;
      }else if(this.bahasa=="en"){
        this.message_confirm_logout       = response.en.message_confirm_logout;
        this.menu1      = response.en.menu1;
        this.menu2      = response.en.menu2;
        this.menu3      = response.en.menu3;
        this.menu4      = response.en.menu4;
        this.menu5      = response.en.menu5;
      }else if(this.bahasa=="ch"){
        this.message_confirm_logout       = response.ch.message_confirm_logout;
        this.menu1      = response.ch.menu1;
        this.menu2      = response.ch.menu2;
        this.menu3      = response.ch.menu3;
        this.menu4      = response.ch.menu4;
        this.menu5      = response.ch.menu5;
      }
      console.log(response);
    });
  }
  home(){
    this.storage.get('user').subscribe((data) => {
      if(data){
        this.tabIndex = 1;
        this.navCtrl.navigateRoot('/home');
      }else{
        const alert = this.alertController.create({header: '',message: "Please Login to continue",buttons: [{text: 'Ok',role: 'ok'}]}).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
      }
    });
  }
  survey(){
    this.storage.get('user').subscribe((data) => {
      if(data){
        this.tabIndex = 2;
        this.navCtrl.navigateRoot('/tabs/tab2');
      }else{
        const alert = this.alertController.create({header: '',message: "Please Login to continue",buttons: [{text: 'Ok',role: 'ok'}]}).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
      }
    });
  }
  booking(){
    this.storage.get('user').subscribe((data) => {
      if(data){
        this.tabIndex = 3;
        this.navCtrl.navigateRoot('/tabs/tab3');
      }else{
        const alert = this.alertController.create({header: '',message: "Please Login to continue",buttons: [{text: 'Ok',role: 'ok'}]}).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
      }
    });
  }
  pengaturan(){
    this.storage.get('user').subscribe((data) => {
      if(data){
        this.tabIndex = 4;
        this.navCtrl.navigateRoot('/tabs/tab4');
      }else{
        const alert = this.alertController.create({header: '',message: "Please Login to continue",buttons: [{text: 'Ok',role: 'ok'}]}).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
      }
    });
  }
  goToLogin(){
    //this.navCtrl.navigateRoot('/login');
    let navigationExtras: NavigationExtras = {
      state: {
        id : "0"
      }
    };
    this.router.navigate(['login'], navigationExtras);
  }
  logout(){
    const alert = this.alertController.create({
      header: '',
      message: this.message_confirm_logout,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Ok',
          handler: () => {
            //console.log("logout");
            this.storage.delete('user').subscribe(() => {});
            this.navCtrl.navigateRoot('/home');
            this.cekLogin();
          }
        }
      ]
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        //console.log('Loading dismissed!');
      });
    });
  }
  cekLogin(){
    this.storage.get('user').subscribe((data) => {
      ////console.log(data);
      if(data){
        this.user = data;
        this.isLogin = true;
        //this.menuCtrl.enable(true);
        //this.menuCtrl.swipeEnable(true);
      }else{
        this.isLogin = false;
        //this.menuCtrl.enable(false);
        //this.menuCtrl.swipeEnable(false);
      }
    });
  }

}
