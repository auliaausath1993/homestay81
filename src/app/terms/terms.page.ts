import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras} from '@angular/router';
import { ToastController, LoadingController } from "@ionic/angular";
import { MenuController, Events } from '@ionic/angular';
import { Location } from '@angular/common';

import { Plugins } from '@capacitor/core';
import { map } from "rxjs/operators";

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {

  picked = [];
  list = [];
  base_url_image;
  terms;
  
  constructor(
    private http: Http,
    private router: Router,
    private location: Location,
    private serv: MyserviceService,
    private loadingController : LoadingController,) {
      this.base_url_image = this.serv.base_url_image;
      this.getData();
    }

  ngOnInit() {
  }
  backToHome(){
    //this.router.navigateByUrl('/home');
    this.location.back();
  }
  async getData(){
    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;

    // body.append("pelanggan_id",this.pelanggan_id);
    // body.append("latitude",this.lat.toString());
    // body.append("longitude",this.lng.toString());

    this.http.post(this.serv.base_url+"get_setting", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();
        this.terms = response.data.terms;
        //console.log(data);
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  pick(data){
    if(this.picked.indexOf(data) > -1){
      let idx = this.picked.indexOf(data);
      console.log(idx);
      this.picked.splice(idx,1);
    }else{
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
    this.router.navigateByUrl('/berhasil-topup');
  }

}
