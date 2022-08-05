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
  selector: 'app-list-survey',
  templateUrl: './list-survey.page.html',
  styleUrls: ['./list-survey.page.scss'],
})
export class ListSurveyPage implements OnInit {
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
  list_survey = [];

  base;
  showSkeleton = true;
  
  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,  
    private serv: MyserviceService,
    private storage: StorageMap,
    public toastController: ToastController,
    private alertController: AlertController,
    private location: Location,
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
  async getData(){
    const position = await Plugins.Geolocation.getCurrentPosition();
    //console.log(position);
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

    body.append("pelanggan_id",this.user.id);

    this.http.post(this.serv.base_url+"list_survey", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();

        if(response.status=="Success"){
          this.list_survey = response.list_survey;
          this.showSkeleton = false;

          if(response.list_survey.length==0){
            const alert = this.alertController.create({
            message: "No Data",
            buttons: ['Ok']}).then(alert=> alert.present());
          }
        }else{
          this.showSkeleton = false;
          const alert = this.alertController.create({
          message: "No Data",
          buttons: ['Ok']}).then(alert=> alert.present());
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
      }else if(this.bahasa=="en"){
        this.terdekat_subtitle       = response.en.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.en.GPS_SUBTITLE;
        this.filter_subtitle         = response.en.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.en.DAFTAR_SUBTITLE;
      }else if(this.bahasa=="ch"){
        this.terdekat_subtitle       = response.ch.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.ch.GPS_SUBTITLE;
        this.filter_subtitle         = response.ch.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.ch.DAFTAR_SUBTITLE;
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
    let navigationExtras: NavigationExtras = {
      state: {
        id : data.id
      }
    };
    this.router.navigate(['detail'], navigationExtras);
  }
  myBackButton(){
    this.location.back();
  }
  toRp(val){
    return this.serv.toRp(val)
  }

}
