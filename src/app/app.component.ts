import { MyserviceService } from './myservice.service';
import { Http } from '@angular/http';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { Platform, NavController, MenuController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

import { StorageMap } from '@ngx-pwa/local-storage';
import { Location } from '@angular/common';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  isLogin = false;
  nama;
  user;

  bahasa;bahasa_name;
  message_confirm_logout;

  menu1;menu2;menu3;menu4;menu5;

  public appPages;

  constructor(
    private http: Http,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: StorageMap,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private events: Events,
    private alertController: AlertController,
    private router: Router,
    private fcm: FCM,
    private firebaseX: FirebaseX,
    private location: Location,
    private serv: MyserviceService,
  ) {
    this.initializeApp();
    this.cekLogin();
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);

    events.subscribe('user:created', (user, time) => {
      //console.log("events ",user);
      this.nama = user.nama;
      this.cekLogin();
    });
    setTimeout(()=>{
      console.log("GET TOKEN BGST!");
      this.firebaseX.getToken()
      .then(token => console.log(`The token is ${token}`))
      .catch(error => console.error('Error getting token', error));
      this.fcm.getToken().then(token => {
        console.log("token");
        console.log(token);
        this.serv.fcm_token = token;
      });
    }, 2000);

  }
  ngOnInit() {
    var OneSignal = window['OneSignal'] || [];
    console.log("Init OneSignal");
    OneSignal.push(["init", {
      appId: "235e6c76-260f-405c-b009-97f5883f2abe", //PROD
      //appId: "203b5391-6690-48fd-a41c-f7c1c33abefd",   //DEV
      autoRegister: true,
      allowLocalhostAsSecureOrigin: true,
      notifyButton: {
        enable: false
      }
    }]);
    console.log('OneSignal Initialized');

    let self = this;
    OneSignal.push(function () {
      console.log('Register For Push');
      OneSignal.push(["registerForPushNotifications"]);

      OneSignal.getUserId().then(function (userId) {
        console.log("User ID is", userId);
        self.storage.set('userId',userId).subscribe(() => {});
      });

    });
    OneSignal.push(function () {
      // Occurs when the user's subscription changes to a new value.
      OneSignal.on('subscriptionChange', function (isSubscribed) {
        console.log("The user's subscription state is now:", isSubscribed);
        OneSignal.getUserId().then(function (userId) {
          self.storage.set('userId',userId).subscribe(() => {});
          //console.log("User ID is", userId);
          //this.storage.set('userId',userId).subscribe(() => {});
        });
      });
    });
    console.log("GET TOKEN BGST!");
    this.firebaseX.getToken()
    .then(token => console.log(`The token is ${token}`))
    .catch(error => console.error('Error getting token', error));
    this.fcm.getToken().then(token => {
      console.log("token");
      console.log(token);
      this.serv.fcm_token = token;
    });
  }
  cekLogin(){
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);
    this.storage.get('user').subscribe((data) => {
      ////console.log(data);
      // if(data){
      //   this.user = data;
      //   this.isLogin = true;
      //   this.menuCtrl.enable(true);
      //   this.menuCtrl.swipeGesture(true);
      // }else{
      //   this.isLogin = false;
      //   this.menuCtrl.enable(false);
      //   this.menuCtrl.swipeGesture(false);
      // }
    });
  }
  initializeApp() {
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      //this.splashScreen.hide();
    console.log("GET TOKEN BGST!");
    this.firebaseX.getToken()
    .then(token => console.log(`The token is ${token}`))
    .catch(error => console.error('Error getting token', error));

    this.firebaseX.getToken().then(token => {
      console.log("GET TOKEN BGST!");
      console.log(token);
      this.serv.fcm_token = token;
    });

    //this.firebaseX.onMessageReceived().subscribe(data => console.log(`User opened a notification ${data}`));
    this.firebaseX.onMessageReceived().subscribe(data => {
      console.log("PUSH MESSAGE");
      console.log(data);
      if(data.wasTapped){
        console.log("Received in background");
      } else {
        this.alertController.create({
          header: 'Notification',
          message: data.body,
          buttons: [{
              text: 'Ok',
              cssClass: 'btn-center',
              handler: () => {
                
              }
            }
          ]
        }).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
        console.log("Received in foreground");
      };
    });


    this.fcm.getToken().then(token => {
      console.log("token");
      console.log(token);
      this.serv.fcm_token = token;
    });
      
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




    this.platform.ready().then(() => {
      document.addEventListener("backbutton", (event) => { 
        console.log(this.router.url);
        if (this.router.isActive('/tabs/tab1', true) && this.router.url === '/tabs/tab1') {
          //if(this.serv.canGoBack){
            this.showAlert();
          //}
        }else if (this.router.isActive('/login', true) && this.router.url === '/login') {
          //if(this.serv.canGoBack){
            this.showAlert();
          //}
        }else{
          this.location.back();
        }
      });
    });



    });
  }

  async showAlert(){
    const alert = await this.alertController.create({
      header: 'Close app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Close',
          handler: () => {
            navigator['app'].exitApp();
          }
        }
      ]
    });

    await alert.present();
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

      this.appPages = [
        {
          title: this.menu1,
          url: '/home',
          action: 'null',
          icon: 'home'
        },
        {
          title: this.menu2,
          url: '/list-survey',
          action: 'null',
          icon: 'eye'
        },
        {
          title: this.menu3,
          url: '/list-booking',
          action: 'null',
          icon: 'document'
        },
        {
          title: this.menu4,
          url: '/pengaturan',
          action: 'null',
          icon: 'cog'
        },
        {
          title: this.menu5,
          url: '/survey',
          action: 'logout',
          icon: 'exit'
        }
      ]
    });
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
}
