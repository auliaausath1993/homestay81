import { Location } from '@angular/common';
import { MyserviceService } from './../myservice.service';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import { ToastController, LoadingController, AlertController } from "@ionic/angular";

import { Plugins } from '@capacitor/core';
import { map } from "rxjs/operators";

import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
 
declare var google;

@Component({
  selector: 'app-list2',
  templateUrl: './list2.page.html',
  styleUrls: ['./list2.page.scss'],
})
export class List2Page implements OnInit {
  loading;
  terdekat_subtitle;gps_subtitle;filter_subtitle;daftar_subtitle;
  bahasa;bahasa_name;

  lat: number;
  lng: number;
  address: string;
  collection = [1,1,1,1,1,1,1,1];

  daerah;
  latest_homestay = [];

  page = 1;
  jenis = "putra";
  type  = "";
  daerah_id;

  base;
  noData = false;
  subtitle_jenis1;
  subtitle_jenis2;
  subtitle_bulan;
  message_no_data;

  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;

  pelanggan_id;
  val;
  
  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,  
    private serv: MyserviceService,
    private storage: StorageMap,
    public toastController: ToastController,
    private location: Location,
    private alertController: AlertController,
    private loadingController : LoadingController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
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
    this.storage.get('user').subscribe((data) => {
      if(data){
        //console.log(data);
      }
    });
  }
  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      //this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.loadMap(resp.coords.latitude, resp.coords.longitude);
 
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    Plugins.Geolocation.getCurrentPosition().then(result => {
      this.lat = result.coords.latitude;
      this.lng = result.coords.longitude;
    });
  }

  loadMap(lat,lng){
    let latLng = new google.maps.LatLng(lat,lng);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    var marker = new google.maps.Marker({position: latLng, map: this.map, title: 'Your Location'});

    this.getData();
  }
  async ionViewWillEnter(){
    const position = await Plugins.Geolocation.getCurrentPosition();
    //console.log(position);
    this.loading = this.loadingController.create({
      duration: 5000,
      message: 'Please Wait'
    }).then((res) => {
      //res.present();

      res.onDidDismiss().then((dis) => {
        //console.log('Loading dismissed!');
      });
    });

    //this.getCurrentLocation();
  }

  getData(){
    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;

    if(this.type=="jenis"){
      body.append("jenis",this.jenis);
    }else if(this.type=="daerah_id"){
      body.append("daerah_id",this.daerah_id);
    }

    this.http.post(this.serv.base_url+"list_homestay", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();
        var marker = [];
        var infowindow = [];
        this.latest_homestay = response.latest_homestay;
        if(this.latest_homestay.length==0){
          this.noData = true;
        }
        for(let x = 0;x<this.latest_homestay.length;x++){
          marker[x] = new google.maps.Marker({
            position: new google.maps.LatLng(this.latest_homestay[x].latlong.split(",")[0], this.latest_homestay[x].latlong.split(",")[1]),
            map: this.map, 
            icon: 'assets/icons/icon-15x15.png',
            title: this.latest_homestay[x].name
          });

          infowindow[x] = new google.maps.InfoWindow();
          infowindow[x].setContent(this.latest_homestay[x].nama);
          marker[x].addListener('click', function() {
            infowindow[x].open(this.map, marker[x]);
          });
        }

        //console.log(data);
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  getCurrentLocation() {

    this.noData = false;

    Plugins.Geolocation.getCurrentPosition().then(result => {
      this.lat = result.coords.latitude;
      this.lng = result.coords.longitude;

      var headers = new Headers();
      headers.append("x-api-key", this.serv.header_key);
      let requestOptions = new RequestOptions({ headers: headers });
      let body = new FormData;

      body.append("lat",this.lat.toString());
      body.append("long",this.lng.toString());
      body.append("page",this.page.toString());

      if(this.type=="jenis"){
        body.append("jenis",this.jenis);
      }else if(this.type=="daerah_id"){
        body.append("daerah_id",this.daerah_id);
      }

      this.http.post(this.serv.base_url+"list_homestay", body, requestOptions)
      .subscribe(data => {
          this.loadingController.dismiss();
          var response = data.json();

          this.daerah = response.daerah;
          this.latest_homestay = response.latest_homestay;

          if(response.latest_homestay.length==0){
            this.noData = true;
            const alert = this.alertController.create({
            message: this.message_no_data,
            buttons: ['Ok']}).then(alert=> alert.present());
          }
          //console.log(data);
        }, error => {
          this.loadingController.dismiss();
          //console.log(error);
      });

      //this.getAddress(this.lat, this.lng);
    });
  }

  // This function makes an http call to google api to decode the cordinates

  private getAddress(lat: number, lan: number) {
    this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lan}&key=`+this.serv.map_key)
    .subscribe(data => {
        //console.log(data);
      }, error => {
        //console.log(error);
    });
    //`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lan}&key=`+this.serv.map_key
  }

  // function to display the toast with location and dismiss button

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.address,

      position: "middle",
      buttons: [
        {
          icon: "close-circle",
          role: "cancel"
        }
      ]
    });
    toast.present();
  }

  // click function to display a toast message with the address

  onMarkerClick() {
    this.presentToast();
  }
  getSubtitleJenis(jenis){
    if(jenis=="putra"){
      return this.subtitle_jenis1;
    }else{
      return this.subtitle_jenis2;
    }
  }
  getSubtitle(){
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      var response = data.json();
      if(this.bahasa=="id"){
        this.terdekat_subtitle      = response.id.TERDEKAT_SUBTITLE;
        this.gps_subtitle           = response.id.GPS_SUBTITLE;
        this.filter_subtitle        = response.id.FILTER_SUBTITLE;
        this.daftar_subtitle        = response.id.DAFTAR_SUBTITLE;
        this.subtitle_jenis1        = response.id.subtitle_jenis1;
        this.subtitle_jenis2        = response.id.subtitle_jenis2;
        this.subtitle_bulan         = response.id.subtitle_bulan;
        this.message_no_data        = response.id.message_no_data;
      }else if(this.bahasa=="en"){
        this.terdekat_subtitle       = response.en.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.en.GPS_SUBTITLE;
        this.filter_subtitle         = response.en.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.en.DAFTAR_SUBTITLE;
        this.subtitle_jenis1         = response.en.subtitle_jenis1;
        this.subtitle_jenis2         = response.en.subtitle_jenis2;
        this.subtitle_bulan          = response.en.subtitle_bulan;
        this.message_no_data         = response.en.message_no_data;
      }else if(this.bahasa=="ch"){
        this.terdekat_subtitle       = response.ch.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.ch.GPS_SUBTITLE;
        this.filter_subtitle         = response.ch.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.ch.DAFTAR_SUBTITLE;
        this.subtitle_jenis1         = response.ch.subtitle_jenis1;
        this.subtitle_jenis2         = response.ch.subtitle_jenis2;
        this.subtitle_bulan          = response.ch.subtitle_bulan;
        this.message_no_data         = response.ch.message_no_data;
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
    //this.router.navigate(['detail'], navigationExtras);
    this.router.navigate(['/detail'], { queryParams: { id : data.id } });
  }
  backToHome(){
    this.router.navigateByUrl('/home');
  }
  myBackButton(){
    this.location.back();
  }
  toRp(val){
    return this.serv.toRp(val)
  }

}
