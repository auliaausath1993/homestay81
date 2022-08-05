import { PopupCalendarPage } from './../popup-calendar/popup-calendar.page';
import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras} from '@angular/router';
import { ToastController, LoadingController } from "@ionic/angular";
import { MenuController, Events, ModalController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { map } from "rxjs/operators";

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
 
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  loading;
  terdekat_subtitle;gps_subtitle;filter_subtitle;daftar_subtitle;
  bahasa;bahasa_name;

  lat: number = 0;
  lng: number = 0;
  address: string;
  collection = [1,1,1,1,1,1,1,1];

  daerah;
  latest_homestay = [];
  nearest_homestay = [];
  new_nearest_homestay = [];

  pelanggan_id;
  val;

  base;
  base_url;
  base_url_image;
  
  subtitle_kamar;
  subtitle_jenis1;
  subtitle_jenis2;
  subtitle_jenis3;
  subtitle_bulan;
  subtitle_hari;

  slideOpts;
  slide_array = [];
  pelanggan;
  menu1;
  banners: any[] = [1,1,1,1,1];
  isClicked = false;

  isVIP = false;
  today;poin;

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private serv: MyserviceService,
    private storage: StorageMap,
    public toastController: ToastController,
    public menuCtrl: MenuController,
    private loadingController : LoadingController,
    private geolocation: Geolocation,
    private modalController: ModalController,
    private nativeGeocoder: NativeGeocoder
  ) {
    this.base_url_image = this.serv.base_url_image;
    this.base           = this.serv.base_url_img;


    this.slideOpts = {
      initialSlide: 0,
      speed: 400
    };
    
    this.storage.get('bahasa').subscribe((data) => {
      if(data){
        this.bahasa = data;
        this.storage.get('bahasa_name').subscribe((data) => {
          if(data){
            this.bahasa_name = data;
            this.getSubtitle();
          }
        });
      }else{
        this.bahasa         = this.serv.bahasa;
        this.bahasa_name    = this.serv.bahasa_name;
        this.storage.set('bahasa',this.bahasa).subscribe(() => {
          this.storage.set('bahasa_name',this.bahasa_name).subscribe(() => {
            this.getSubtitle();
          });
        });
      }
    });
    this.storage.get('user').subscribe((data) => {
      if(data){
        //console.log(data);
        this.val = data;
        this.pelanggan_id = this.val.id;
      }
    });
    
  }
  doRefresh(event){
    setTimeout( () => {
      this.getHomeData(); 
    }, 1000);

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 3000);
  }
  ngOnInit(){
    
  }
  async ionViewWillEnter(){
    this.slideOpts = {
      initialSlide: 0,
      speed: 400
    };
    this.new_nearest_homestay = [];
    this.storage.get('user').subscribe((data) => {
      if(data){
        //console.log(data);
        this.menuCtrl.enable(true);
        this.menuCtrl.swipeGesture(true);
      }else{
        //console.log("belum login bos!");
        this.menuCtrl.enable(false);
        this.menuCtrl.swipeGesture(false);
      }
    });

    //const position = await Plugins.Geolocation.getCurrentPosition();
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



    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    this.today = yyyy+"-"+mm+"-"+dd;


    setTimeout( () => {
      this.getHomeData(); 
    }, 1000);
    //this.getCurrentLocation();
  }
  onChangeDate(event){
    console.log(event);
    let vals = event.detail.value;
    let date = vals.split("T")[0];
    console.log(date);
    this.today = date;
    this.getHomeData();
  }
  getCurrentLocation() {

    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.getHomeData();

    }).catch((error) => {
      console.log('Error getting location', error);
    });

    Plugins.Geolocation.getCurrentPosition().then(result => {
      this.lat = result.coords.latitude;
      this.lng = result.coords.longitude;
    });
    
    // Plugins.Geolocation.getCurrentPosition().then(result => {
    //   this.lat = result.coords.latitude;
    //   this.lng = result.coords.longitude;
    //   this.getHomeData();
    // }, err => {
    //   console.error(err);
    //   alert("Failed Getting Location");
    //   this.getHomeData();
    // },);
  }
  getSubtitleJenis(jenis){
    if(jenis=="putra"){
      return this.subtitle_jenis1;
    }else if(jenis=="putri"){
      return this.subtitle_jenis2;
    }else{
      return this.subtitle_jenis3;
    }
  }
  async popupCalendar(){
    const modal = await this.modalController.create({
      component: PopupCalendarPage,
      mode: "ios",
      showBackdrop: true,
      componentProps: {
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      
      if (dataReturned !== null) {
        console.log(dataReturned);
        this.today = dataReturned.data;
        if(dataReturned.data==undefined){
          var today = new Date();
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();
          this.today = yyyy+"-"+mm+"-"+dd;
        }
        
        this.getHomeData();
        //alert('Modal Sent Data :'+ dataReturned);
      }else{
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        this.today = yyyy+"-"+mm+"-"+dd;
      }
    });
    return await modal.present();
  }
  async getHomeData(){
    this.loading = this.loadingController.create({
      duration: 3000,
      message: 'Please Wait'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        //console.log('Loading dismissed!');
      });
    });

    this.new_nearest_homestay = [];
    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;

    body.append("date",this.today);
    body.append("pelanggan_id",this.pelanggan_id);
    body.append("latitude",this.lat.toString());
    body.append("longitude",this.lng.toString());

    this.http.post(this.serv.base_url+"homedata", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();

        this.banners = response.banner;
        this.daerah = response.daerah;
        this.latest_homestay = response.latest_homestay;
        this.nearest_homestay = response.nearest_homestay;
        this.pelanggan = response.pelanggan
        this.slide_array = [];
        for(let x = 0;x<response.nearest_homestay.length;x++){
          if(x%2==0){
            this.slide_array.push(x);
          }
        }

        let index_utama = 0;
        this.new_nearest_homestay = [];
        for(let x = 0;x<this.slide_array.length;x++){
          let newarray = [];
          //console.log(this.slide_array[x]);
          for(let z = this.slide_array[x];z<this.slide_array[x]+2;z++){
            //if(z<(x+2)){
              
              let valueToPush = response.nearest_homestay[z];
              newarray.push(valueToPush);

              this.new_nearest_homestay[index_utama] = newarray;
            //}
          }
          index_utama++;
        }

        if(response.pelanggan.vip=='yes'){
          this.isVIP = true;
        }
        this.poin = response.pelanggan.poin;

        //console.log("array baru");
        //console.log(this.slide_array);
        console.log(this.new_nearest_homestay);

        this.events.publish('user:created', response.pelanggan, Date.now());
        //console.log(data);
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
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
  getSubtitle(){
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      var response = data.json();
      if(this.bahasa=="id"){
        this.terdekat_subtitle      = response.id.TERDEKAT_SUBTITLE;
        this.gps_subtitle           = response.id.GPS_SUBTITLE;
        this.filter_subtitle        = response.id.FILTER_SUBTITLE;
        this.daftar_subtitle        = response.id.DAFTAR_SUBTITLE;
        this.subtitle_kamar         = response.id.subtitle_kamar;
        this.subtitle_jenis1        = response.id.subtitle_jenis1;
        this.subtitle_jenis2        = response.id.subtitle_jenis2;
        this.subtitle_jenis3        = response.id.subtitle_jenis3;
        this.subtitle_bulan         = response.id.subtitle_bulan;
        this.subtitle_hari          = response.id.subtitle_hari;
        this.menu1                  = response.id.menu1;
      }else if(this.bahasa=="en"){
        this.terdekat_subtitle       = response.en.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.en.GPS_SUBTITLE;
        this.filter_subtitle         = response.en.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.en.DAFTAR_SUBTITLE;
        this.subtitle_kamar          = response.en.subtitle_kamar;
        this.subtitle_jenis1         = response.en.subtitle_jenis1;
        this.subtitle_jenis2         = response.en.subtitle_jenis2;
        this.subtitle_jenis3         = response.en.subtitle_jenis3;
        this.subtitle_bulan          = response.en.subtitle_bulan;
        this.subtitle_hari           =  response.en.subtitle_hari;
        this.menu1                   = response.en.menu1;
      }else if(this.bahasa=="ch"){
        this.terdekat_subtitle       = response.ch.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.ch.GPS_SUBTITLE;
        this.filter_subtitle         = response.ch.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.ch.DAFTAR_SUBTITLE;
        this.subtitle_kamar          = response.ch.subtitle_kamar;
        this.subtitle_jenis1         = response.ch.subtitle_jenis1;
        this.subtitle_jenis2         = response.ch.subtitle_jenis2;
        this.subtitle_jenis3         = response.ch.subtitle_jenis3;
        this.subtitle_bulan          = response.ch.subtitle_bulan
        this.subtitle_hari           = response.ch.subtitle_hari
        this.menu1                   = response.ch.menu1;
      }
      //console.log(response);
    });
  }
  goToJenis(jenis){
    let navigationExtras: NavigationExtras = {
      state: {
        type : "jenis",
        jenis : jenis
      }
    };
    this.router.navigate(['list'], navigationExtras);
  }
  goToMap(){
    let navigationExtras: NavigationExtras = {
      state: {
        
      }
    };
    this.router.navigate(['map'], navigationExtras);
  }
  goToKota(daerah_id){
    // let navigationExtras: NavigationExtras = {
    //   state: {
    //     type : "daerah_id",
    //     daerah_id : daerah_id
    //   }
    // };
    // this.router.navigate(['list2'], navigationExtras);

    let tgl = this.today;
    let navigationExtras: NavigationExtras = {
      state: {
        tanggal : tgl,
        daerah_id: daerah_id,
        min: 0,
        max: 9000000000,
        fasilitas: [],
      }
    };
    this.router.navigate(['list'], navigationExtras);
  }
  goToDetail(data){
    //this.router.navigateByUrl('/detail');
    let navigationExtras: NavigationExtras = {
      state: {
        id : data.id
      }
    };
    //this.router.navigate(['detail'], navigationExtras);
    this.router.navigate(['/detail'], { queryParams: { id : data.id } });
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
  detailNews(data){
    this.router.navigate(['/news-detail'], { queryParams: { id : data.detail_id } });
  }
  goToFilter(){
    this.router.navigate(['/filter'], { queryParams: { id : '' } });
  }
  goToNotif(){ 
    this.router.navigate(['/notification'], { queryParams: { id : '' } });
  }
  goToTopup(){
    this.router.navigate(['/topup-poin'], { queryParams: { id : '' } });
  }
  toRp(val){
    return this.serv.toRp(val)
  }
  round(val){
    return Math.round(val);
  }

}
