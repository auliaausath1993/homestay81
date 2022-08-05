import { alertController } from '@ionic/core';
import { LoadingController, AlertController, Events } from '@ionic/angular';
import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lupa-password',
  templateUrl: './lupa-password.page.html',
  styleUrls: ['./lupa-password.page.scss'],
})
export class LupaPasswordPage implements OnInit {
  bahasa;bahasa_name;
  login_subtitle;placeholder_username;placeholder_password;
  placeholder_login;placeholder_lupa;placeholder_otp;akun_subtitle;
  loading;

  hp;otp;

  isRequestedOTP = false;
  isOTPTrue = false;

  password;password2;

  constructor(
    private http: Http,
    private events: Events,
    private router: Router,
    private serv: MyserviceService,
    private storage: StorageMap,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
    this.storage.get('bahasa').subscribe((data) => {
      if(data){
        this.bahasa = data;
      }
    });
    this.storage.get('bahasa_name').subscribe((data) => {
      if(data){
        this.bahasa_name = data;
      }
    });
    this.getSubtitle();
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
      }else if(this.bahasa=="en"){
        this.login_subtitle       = response.en.LOGIN_SUBTITLE;
        this.placeholder_username = response.en.PLACEHOLDER_USERNAME;
        this.placeholder_password = response.en.PLACEHOLDER_PASSWORD;
        this.placeholder_login    = response.en.PLACEHOLDER_LOGIN;
        this.placeholder_lupa     = response.en.PLACEHOLDER_LUPA;
        this.placeholder_otp      = response.en.PLACEHOLDER_OTP;
        this.akun_subtitle        = response.en.AKUN_SUBTITLE;
      }else if(this.bahasa=="ch"){
        this.login_subtitle       = response.ch.LOGIN_SUBTITLE;
        this.placeholder_username = response.ch.PLACEHOLDER_USERNAME;
        this.placeholder_password = response.ch.PLACEHOLDER_PASSWORD;
        this.placeholder_login    = response.ch.PLACEHOLDER_LOGIN;
        this.placeholder_lupa     = response.ch.PLACEHOLDER_LUPA;
        this.placeholder_otp      = response.ch.PLACEHOLDER_OTP;
        this.akun_subtitle        = response.ch.AKUN_SUBTITLE;
      }
      //console.log(response);
    });
  }
  requestOtp(){
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

    this.http.post(this.serv.base_url+"request_otp_lupa", body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      var response = data.json();
      //console.log(response);
        const alert = this.alertController.create({
        header: response.status,
        message: response.message,
        buttons: ['Ok']}).then(alert=> alert.present());

        if(response.status=="Failed"){
          
        }else{
          this.isRequestedOTP = true;
        }
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  login(){
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

    this.http.post(this.serv.base_url+"cek_otp_lupa", body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      var response = data.json();
      //console.log(response);
        const alert = this.alertController.create({
        header: response.status,
        message: response.message,
        buttons: ['Ok']}).then(alert=> alert.present());

        if(response.status=="Failed"){
          
        }else{
          this.isOTPTrue = true;
        }
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
    
  }
  goToLupaPassword(){
    this.router.navigateByUrl('/lupa-password');
  }
  register(){
    this.router.navigateByUrl('/register');
  }
  ngOnInit() {
  }

}
