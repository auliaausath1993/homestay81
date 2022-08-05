import { Location } from '@angular/common';
import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import { ToastController, LoadingController, AlertController } from "@ionic/angular";

import { Plugins } from '@capacitor/core';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-list-booking',
  templateUrl: './list-booking.page.html',
  styleUrls: ['./list-booking.page.scss'],
})
export class ListBookingPage implements OnInit {
  loading;
  terdekat_subtitle;gps_subtitle;filter_subtitle;daftar_subtitle;
  bahasa;bahasa_name;

  lat: number;
  lng: number;
  address: string;
  collection = [1,1,1,1,1,1,1,1];

  daerah;
  latest_homestay;

  page = 1;
  jenis = "putra";
  type  = "";
  daerah_id;

  user;
  list = [];
  status_bayar = "unpaid";

  base;
  noData = false;
  message_no_data;
  
  menunggu_konfirmasi;

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,  
    private serv: MyserviceService,
    private storage: StorageMap,
    public toastController: ToastController,
    private location: Location,
    private alertController: AlertController,
    private loadingController : LoadingController
  ) {
    this.base           = this.serv.base_url_img;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.type = this.router.getCurrentNavigation().extras.state.type;
        this.daerah_id = this.router.getCurrentNavigation().extras.state.daerah_id;
        this.jenis = this.router.getCurrentNavigation().extras.state.jenis;
      }
    });

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
  ngOnInit() {
  }
  doRefresh(event){
    setTimeout( () => {
      this.getData(); 
    }, 1000);

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 3000);
  }
  async ionViewWillEnter(){
    this.storage.get('user').subscribe((data) => {
      if(data){
        this.user = data;
        this.getData();
      }
    });
  }
  gantiStatus(status){
    this.status_bayar = status;
    this.getData();
  }
  async getData(){
    this.noData = false;
    const position = await Plugins.Geolocation.getCurrentPosition();
    //console.log(position);
    this.loading = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      //res.present();

      res.onDidDismiss().then((dis) => {
        //console.log('Loading dismissed!');
      });
    });
    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;

    body.append("pelanggan_id",this.user.id);
    body.append("status_bayar",this.status_bayar);

    this.http.post(this.serv.base_url+"list_booking", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();

        if(response.status=="Success"){
          this.list = response.list
          if(response.list.length==0){
            this.noData = true;
            const alert = this.alertController.create({
            message: this.message_no_data,
            buttons: ['Ok']}).then(alert=> alert.present());
          }
        }
        //console.log(data);
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  getSubtitle(){
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      var response = data.json();
      if(this.bahasa=="id"){
        this.terdekat_subtitle      = response.id.TERDEKAT_SUBTITLE;
        this.gps_subtitle           = response.id.GPS_SUBTITLE;
        this.filter_subtitle        = response.id.FILTER_SUBTITLE;
        this.daftar_subtitle        = response.id.DAFTAR_SUBTITLE;
        this.message_no_data        = response.id.message_no_data;
        this.menunggu_konfirmasi     = response.id.menunggu_konfirmasi;
      }else if(this.bahasa=="en"){
        this.terdekat_subtitle       = response.en.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.en.GPS_SUBTITLE;
        this.filter_subtitle         = response.en.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.en.DAFTAR_SUBTITLE;
        this.message_no_data         = response.en.message_no_data;
        this.menunggu_konfirmasi     = response.en.menunggu_konfirmasi;
      }else if(this.bahasa=="ch"){
        this.terdekat_subtitle       = response.ch.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.ch.GPS_SUBTITLE;
        this.filter_subtitle         = response.ch.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.ch.DAFTAR_SUBTITLE;
        this.message_no_data         = response.ch.message_no_data;
        this.menunggu_konfirmasi     = response.ch.menunggu_konfirmasi;
      }
      //console.log(response);
    });
  }
  goToJenis(jenis){
    let navigationExtras: NavigationExtras = {
      state: {
        transaksi: jenis
      }
    };
    this.router.navigate(['list'], navigationExtras);
  }
  goToDetail(data){
    if(data.status!="cancel"){
      let navigationExtras: NavigationExtras = {
        state: {
          id : data.id
        }
      };
      this.router.navigate(['detail-booking'], navigationExtras);
    }
  }
  myBackButton(){
    this.location.back();
  }
  toRp(val){
    return this.serv.toRp(val)
  }

}
