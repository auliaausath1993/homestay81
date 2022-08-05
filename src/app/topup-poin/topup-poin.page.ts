import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras} from '@angular/router';
import { ToastController, LoadingController } from "@ionic/angular";
import { MenuController, Events } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { map } from "rxjs/operators";

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-topup-poin',
  templateUrl: './topup-poin.page.html',
  styleUrls: ['./topup-poin.page.scss'],
})
export class TopupPoinPage implements OnInit {
  picked = [];
  list = [];
  val;pelanggan_id;
  isPicked = false;
  loading;

  constructor(
    private http: Http,
    private router: Router,
    private storage: StorageMap,
    private serv: MyserviceService,
    private loadingController : LoadingController,) {

    this.storage.get('user').subscribe((data) => {
      if(data){
        //console.log(data);
        this.val = data;
        this.pelanggan_id = this.val.id;
        this.getData();
      }
    });
    
    }

  ngOnInit() {
  }
  async getData(){
    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;

    // body.append("pelanggan_id",this.pelanggan_id);
    // body.append("latitude",this.lat.toString());
    // body.append("longitude",this.lng.toString());

    this.http.post(this.serv.base_url+"get_paket_poin", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();
        this.list = response.data;
        //console.log(data);
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  backToHome(){
    this.router.navigateByUrl('/home');
  }
  pick(data){
    this.isPicked = true;
    if(this.picked.indexOf(data) > -1){
      let idx = this.picked.indexOf(data);
      console.log(idx);
      this.picked.splice(idx,1);
    }else{
      this.picked = [];
      this.picked.push(data);
    }
    console.log(this.picked);
  }
  cek(data){
    if(this.picked.indexOf(data) > -1){
      return true;
    }else{
      return false;
    }
  }
  topup(){

    //loading dulu
    this.loading = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        //console.log('Loading dismissed!');
      });
    });
    //this.router.navigateByUrl('/berhasil-topup');

    // let navigationExtras: NavigationExtras = {
    //   state: {
    //     picked : this.picked,
    //   }
    // };
    // this.router.navigate(['berhasil-topup'], navigationExtras);
    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;

    body.append("pelanggan_id",this.pelanggan_id);
    body.append("paket_id",this.picked[0].toString());
    // body.append("longitude",this.lng.toString());

    this.http.post(this.serv.base_url+"topup_poin", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();
        //this.list = response.data;

        let navigationExtras: NavigationExtras = {
          state: {
            picked : this.picked,
            topup : response.data,
          }
        };
        this.router.navigate(['berhasil-topup'], navigationExtras);
        //console.log(data);
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });    
  }
  toRp(val){
    return this.serv.toRp(val);
  }

}
