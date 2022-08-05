import { alertController } from '@ionic/core';
import { LoadingController, AlertController, Events, ToastController, Platform } from '@ionic/angular';
import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  bahasa;bahasa_name;
  login_subtitle;placeholder_username;placeholder_password;
  placeholder_login;placeholder_lupa;placeholder_otp;akun_subtitle;
  loading;subtitle_time;

  hp;otp;

  isRequestedOTP = false;
  isClicked = false;

  message;
  timer = 60;
  runTimer = false;
  hasStarted = false;
  hasFinished = false;
  isNotAktif = false;

  message_login;button_register;
  message_hp_not_found;
  message_login_failed;

  userId;id;

  private user: SocialUser;
  private loggedIn: boolean;

  ngOnInit(){
    
  }
  constructor(
    private http: Http,
    private router: Router,
    private googlePlus : GooglePlus,
    private events: Events,
    private storage: StorageMap,
    private route: ActivatedRoute, 
    private serv: MyserviceService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private authService: AuthService,
    private fcm: FCM,
    private firebaseX: FirebaseX,
    private fireAuth: AngularFireAuth,
    private platform: Platform,
    private navCtrl: NavController
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
    this.storage.get('bahasa').subscribe((data) => {
      if(data){
        this.bahasa = data;
        this.storage.get('bahasa_name').subscribe((data) => {
          if(data){
            this.bahasa_name = data;
            this.storage.get("userId").subscribe((x)=>{
              this.userId = x;
              console.log(x);
              this.getSubtitle();
            })
          }
        });
      }
    });
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.id = this.router.getCurrentNavigation().extras.state.id;
      }
    });
  }
  getSubtitle(){
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      var response = data.json();
      if(this.bahasa=="id"){
        this.login_subtitle       = response.id.LOGIN_SUBTITLE;
        this.placeholder_username = response.id.PLACEHOLDER_USERNAME;
        this.placeholder_password = response.id.PLACEHOLDER_PASSWORD;
        this.placeholder_login    = response.id.PLACEHOLDER_LOGIN;
        this.placeholder_lupa     = response.id.PLACEHOLDER_LUPA;
        this.placeholder_otp      = response.id.PLACEHOLDER_OTP;
        this.akun_subtitle        = response.id.AKUN_SUBTITLE;
        this.message              = response.id.message_otp;
        this.subtitle_time        = response.id.subtitle_time;
        this.message_login        = response.id.message_login;
        this.button_register      = response.id.button_register;
        this.message_hp_not_found = response.id.message_hp_not_found;
        this.message_login_failed = response.id.message_login_failed;
      }else if(this.bahasa=="en"){
        this.login_subtitle       = response.en.LOGIN_SUBTITLE;
        this.placeholder_username = response.en.PLACEHOLDER_USERNAME;
        this.placeholder_password = response.en.PLACEHOLDER_PASSWORD;
        this.placeholder_login    = response.en.PLACEHOLDER_LOGIN;
        this.placeholder_lupa     = response.en.PLACEHOLDER_LUPA;
        this.placeholder_otp      = response.en.PLACEHOLDER_OTP;
        this.akun_subtitle        = response.en.AKUN_SUBTITLE;
        this.message              = response.en.message_otp;
        this.subtitle_time        = response.en.subtitle_time;
        this.message_login        = response.en.message_login;
        this.button_register      = response.en.button_register;
        this.message_hp_not_found = response.en.message_hp_not_found;
        this.message_login_failed = response.en.message_login_failed;
      }else if(this.bahasa=="ch"){
        this.login_subtitle       = response.ch.LOGIN_SUBTITLE;
        this.placeholder_username = response.ch.PLACEHOLDER_USERNAME;
        this.placeholder_password = response.ch.PLACEHOLDER_PASSWORD;
        this.placeholder_login    = response.ch.PLACEHOLDER_LOGIN;
        this.placeholder_lupa     = response.ch.PLACEHOLDER_LUPA;
        this.placeholder_otp      = response.ch.PLACEHOLDER_OTP;
        this.akun_subtitle        = response.ch.AKUN_SUBTITLE;
        this.message              = response.ch.message_otp;
        this.subtitle_time        = response.ch.subtitle_time;
        this.message_login        = response.ch.message_login;
        this.button_register      = response.ch.button_register;
        this.message_hp_not_found = response.ch.message_hp_not_found;
        this.message_login_failed = response.ch.message_login_failed;
      }
      //console.log(response);
    });
  }
  startTimer() {
    this.runTimer = true;
    this.hasStarted = true;
    this.timerTick();
  }
  timerTick() {
    console.log(this.timer);
    setTimeout(() => {
      if (!this.runTimer) { return; }
      this.timer--;
      if (this.timer > 0) {
        this.timerTick();
      }else {
        this.hasFinished = true;
        this.isRequestedOTP = false;
      }
    }, 1000);
  }
  requestOtp(){
    this.firebaseX.getToken().then(token => {
      console.log(token);
      this.serv.fcm_token = token;
    });

    this.loading = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        //console.log('Loading dismissed!');
      });
    });

    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;
    
    body.append('hp', this.hp);

    this.http.post(this.serv.base_url+"request_otp", body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      var response = data.json();

        if(response.status=="Failed"){
          if(response.reason=="not_found"){
            const alert = this.alertController.create({
            header: response.status,
            message: this.message_hp_not_found,
            buttons: ['Ok']}).then(alert=> alert.present());
          }else{
            const alert = this.alertController.create({
            header: response.status,
            message: this.message,
            buttons: ['Ok']}).then(alert=> alert.present());
          }
        }else{
          const alert = this.alertController.create({
          header: response.status,
          message: this.message,
          buttons: ['Ok']}).then(alert=> alert.present());
          
          this.timer = 60;
          this.startTimer();
          this.isRequestedOTP = true;
        }
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  async login(){
    this.loading = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        //console.log('Loading dismissed!');
      });
    });

    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;
    
    body.append('hp', this.hp);
    body.append('otp', this.otp);
    body.append('userId', this.userId);
    body.append('fcm_token', this.serv.fcm_token);

    this.http.post(this.serv.base_url+"login", body, requestOptions)
    .subscribe(async data => {
      this.loadingController.dismiss();
      var response = data.json();
      //console.log(response);

        if(response.status=="Failed"){
          const alert = this.alertController.create({
          header: response.status,
          message: this.message_login_failed,
          buttons: ['Ok']}).then(alert=> alert.present());
          
        }else{

          // const alert = this.alertController.create({
          // header: response.status,
          // message: this.message_login,
          // buttons: ['Ok']}).then(alert=> alert.present());
          
          const toast = await this.toastController.create({
            message: this.message_login,
            duration: 2000
          });
          toast.present();
          
          let user = response.pelanggan;
          this.events.publish('user:created', user, Date.now());

          this.storage.set('user',user).subscribe(() => {
            if(this.id=="0"){
              this.router.navigateByUrl('/home');
            }else{
              let navigationExtras: NavigationExtras = {
                state: {
                  id : this.id
                }
              };
              //this.router.navigate(['detail'], navigationExtras);
              this.router.navigate(['/detail'], { queryParams: { id : this.id } });
            }
          });
        }
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
    
  }
  pilihBahasa(){
    if(this.isClicked){
      this.isClicked = false;
    }else{
      this.isClicked = true;
    }
  }
  hidePilihan(val,lang){
    this.isClicked = false;
    this.storage.set('bahasa',val).subscribe(() => {
      this.storage.set('bahasa_name',lang).subscribe(() => {
        this.bahasa = val;
        this.bahasa_name = lang;
        this.getSubtitle();
      });
    });
  }
  goToLupaPassword(){
    this.router.navigateByUrl('/lupa-password');
  }
  register(){
    this.router.navigateByUrl('/register');
  }

  // signInWithGoogle(): void {
  //   // this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((res) => {
  //   //   console.log(res);
  //   //   this.doRegister(res);
  //   // });
  //   // this.googlePlus.login({})
  //   // .then(res => {
  //   //   alert('ok' + JSON.stringify(res));
  //   //   this.doRegister(res);
  //   // })
  //   // .catch(err => alert('err' + JSON.stringify(err)));

  //   var id = '919872359812-e1vg1fv75dfvouln4l51q3iqa0igf0k2.apps.googleusercontent.com';
  //   this.firebaseX.authenticateUserWithGoogle(id).then(res => {
  //     this.doRegister(res);
  //   })
  //   .catch(err => alert('err ' + JSON.stringify(err)));
  // }

  signInWithGoogle(){
    let params: any;
    if (this.platform.is('cordova')) {
      if (this.platform.is('android')) {
        params = {
          webClientId: '919872359812-7mpjn44vmcuiu773rvjlki8tbgd0snmg.apps.googleusercontent.com', //  webclientID 'string'
          offline: true
        };
      } else {
        params = {
          webClientId: '919872359812-7mpjn44vmcuiu773rvjlki8tbgd0snmg.apps.googleusercontent.com', //  webclientID 'string'
          offline: true
        };
      }
      this.googlePlus.login(params)
      .then((response) => {
        const { idToken, accessToken } = response;
        console.log(JSON.stringify(response));
        this.onLoginSuccess(idToken, accessToken);
      }).catch((error) => {
        console.log(error);
        console.log('error:' + JSON.stringify(error));
      });
    } else{
      console.log('else...');
      this.fireAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider()).then(success => {
        console.log('success in google login', success);
        this.doRegister(success.user);
      }).catch(err => {
        console.log(err.message, 'error in google login');
      });
    }
  }

  onLoginSuccess(accessToken, accessSecret) {
    const credential = accessSecret ? firebase.default.auth.GoogleAuthProvider
        .credential(accessToken, accessSecret) : firebase.default.auth.GoogleAuthProvider
            .credential(accessToken);
    this.fireAuth.signInWithCredential(credential)
    .then((success) => {
      this.doRegister(success.user);
      this.loading.dismiss();
    }).catch(error => {
      console.log('l ' + JSON.stringify(error))
    });
  }
  
  doRegister(data){
    let val = data;
    console.log(val);
    this.loading = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        //console.log('Loading dismissed!');
      });
    });

    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;
    
    body.append('nama', val.name);
    body.append('googleId', val.googleId);
    body.append('idToken', val.idToken);
    body.append('authToken', val.authToken);
    body.append('email', val.email);
    body.append('fcm_token', this.serv.fcm_token);

    // body.append('alamat', this.alamat);
    // body.append('tempat', this.tempat);
    // body.append('tgl', this.tgl);

    this.http.post(this.serv.base_url+"register_google", body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      var response = data.json();
      //console.log(response);
        // const alert = this.alertController.create({
        // header: response.status,
        // message: response.message,
        // buttons: ['Ok']}).then(alert=> alert.present());

        if(response.status=="Failed"){
          
        }else{
          let user = response.pelanggan;
          this.events.publish('user:created', user, Date.now());
          this.storage.set('user',user).subscribe(() => {
            this.router.navigateByUrl('/home');
          });
        }
      }, error => {
        this.loadingController.dismiss();
        console.log('r ' + JSON.stringify(error))
        //console.log(error);
      });
  }

  back(){
    console.log("button back");
    this.navCtrl.back();
  }

}
