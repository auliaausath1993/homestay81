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
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {
  date;
  type: 'string';

  list_fasilitas = [];
  list_daerah = [];

  picked_fasilitas = [];

  min;max;daerah;
  list_range_harga = [
    0, 100000,300000,500000,700000,1000000,1500000,2000000,3000000,5000000
  ];

  constructor(
    private http: Http,
    private router: Router,
    private serv: MyserviceService,
    private loadingController : LoadingController,
  ) { 
    this.getData();
  }

  ngOnInit() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.date = yyyy+"-"+mm+"-"+dd;
  }
  async getData(){
    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;

    // body.append("pelanggan_id",this.pelanggan_id);

    this.http.post(this.serv.base_url+"get_fasilitas", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();
        this.list_fasilitas = response.data;
        //this.list_daerah = response.daerah;
        this.list_daerah.push({
          "created_at": "2020-03-06 18:36:25",
          "daerah": "-All-",
          "deleted_at": null,
          "id": 0,
          "updated_at": "2020-04-25 15:02:41"
        });
        for(let x=0;x<response.daerah.length;x++){
          this.list_daerah.push(response.daerah[x]);
        }
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  onChange($event) {
    console.log($event);
  }
  backToHome(){
    this.router.navigateByUrl('/home');
  }
  searchFasilitas(data){
    if(this.picked_fasilitas.indexOf(data.id) > -1){
      return true;
    }else{
      return false;
    }
  }
  pick(data){
    if(this.picked_fasilitas.indexOf(data.id) > -1){
      let idx = this.picked_fasilitas.indexOf(data.id);
      console.log(idx);
      this.picked_fasilitas.splice(idx,1);
    }else{
      this.picked_fasilitas.push(data.id);
    }
    console.log(this.picked_fasilitas);
  }
  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
 }
  filter(){
    if(this.date== undefined){
      alert("Please Choose Date First");
    }else{


      console.log(this.formatDate(this.date._d));
      console.log(this.picked_fasilitas);
      console.log(this.min);
      console.log(this.max);
      console.log(this.daerah);

      let tgl = this.formatDate(this.date._d);
      this.serv.tgl = tgl;
      
      let navigationExtras: NavigationExtras = {
        state: {
          tanggal : tgl,
          daerah_id: this.daerah,
          min: this.min,
          max: this.max,
          fasilitas: this.picked_fasilitas,
        }
      };
      this.router.navigate(['list'], navigationExtras);
    }
  }
  toRp(val){
    return this.serv.toRp(val);
  }
}
