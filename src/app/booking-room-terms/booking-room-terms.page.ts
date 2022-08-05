import { MyserviceService } from './../myservice.service';
import { Component, OnInit, Input } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from "@ionic/angular";
import { MenuController, Events, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';

import { Plugins } from '@capacitor/core';
import { map } from "rxjs/operators";

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { BookingPopupPage } from '../booking-popup/booking-popup.page';

@Component({
  selector: 'app-booking-room-terms',
  templateUrl: './booking-room-terms.page.html',
  styleUrls: ['./booking-room-terms.page.scss'],
})
export class BookingRoomTermsPage implements OnInit {

  picked = [];
  list = [];
  base_url_image;
  terms;
  loading;

  @Input("pelanggan_id") pelanggan_id: string;;
  @Input("homestay_id") homestay_id: string;;
  @Input("homestay") homestay: string;;
  @Input("total") total: string;;
  @Input("diskon") diskon: string;;
  @Input("durasi") durasi: string;;
  @Input("tanggal") tanggal: string;;
  @Input("end") end: string;;
  @Input("harga") harga: string;;
  @Input("usePoin") usePoin: string;;
  @Input("satuan") satuan: string;;
  @Input("durasi_id") durasi_id: string;;

  check;
  jumlah_kamar;
  
  constructor(
    private http: Http,
    private router: Router,
    private location: Location,
    private serv: MyserviceService,
    private alertController: AlertController,
    private loadingController : LoadingController,
    private modalController: ModalController,
    private toastController: ToastController,
    private route : ActivatedRoute,
    private navCtrl: NavController,) {
      this.base_url_image = this.serv.base_url_image;
      this.getData();
    }

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        
        //this.id = this.router.getCurrentNavigation().extras.state.id;
        this.pelanggan_id = this.router.getCurrentNavigation().extras.state.pelanggan_id;
        this.homestay_id = this.router.getCurrentNavigation().extras.state.homestay_id;
        this.homestay = this.router.getCurrentNavigation().extras.state.homestay;
        this.total = this.router.getCurrentNavigation().extras.state.total;
        this.diskon = this.router.getCurrentNavigation().extras.state.diskon;
        this.durasi = this.router.getCurrentNavigation().extras.state.durasi;
        this.tanggal = this.router.getCurrentNavigation().extras.state.tanggal;
        this.end = this.router.getCurrentNavigation().extras.state.end;
        this.harga = this.router.getCurrentNavigation().extras.state.harga;
        this.usePoin = this.router.getCurrentNavigation().extras.state.usePoin;
        this.satuan = this.router.getCurrentNavigation().extras.state.satuan;
        this.durasi_id = this.router.getCurrentNavigation().extras.state.durasi_id;
        this.jumlah_kamar = this.router.getCurrentNavigation().extras.state.jumlah_kamar;
        console.log('pelanggan_id', this.pelanggan_id);
        console.log('homestay_id', this.homestay_id);
        console.log('homestay', this.homestay);
        console.log('total', this.total);
        console.log('diskon', this.diskon);
        console.log('durasi', this.durasi);
        console.log('tanggal', this.tanggal);
        console.log('end', this.end);
        console.log('harga', this.harga);
        console.log('usePoin', this.usePoin);
        console.log('satuan', this.satuan);
        console.log('durasi_id', this.durasi_id);
      }
    });

    
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
  async doBooking(){
    if(!this.check){
      const toast = await this.toastController.create({
        message: "please accept all terms & condition for booking",
        duration: 2000
      });
      toast.present();
    }else{
      this.booking();
    }
  }
  async booking(){
    
    const modal = await this.modalController.create({
      component: BookingPopupPage,
      mode: "ios",
      showBackdrop: true,
      cssClass: 'nazor-custom-class',
      componentProps: {
        'pelanggan_id'  : this.pelanggan_id,
        'homestay_id'   : this.homestay_id,
        'homestay'      : this.homestay,
        'total'         : this.total.toString(),
        'diskon'        : (this.diskon).toString(),
        'durasi'        : this.durasi.toString(),
        'tanggal'       : this.tanggal,
        'end'           : this.end,
        'harga'         : this.harga,
        'usePoin'       : this.usePoin,
        'satuan'        : this.satuan,
        'durasi_id'     : this.durasi_id,
        'jumlah_kamar'  : this.jumlah_kamar
      }
    });
    return await modal.present();
  }
  doBookingx(){
    //loading dulu
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

    body.append("pelanggan_id",this.pelanggan_id);
    body.append("homestay_id",this.homestay_id);
    body.append("total",(this.total).toString() );
    body.append("diskon",(this.diskon).toString() );
    body.append("durasi",this.durasi.toString());
    body.append("tanggal",this.tanggal);
    body.append("end",this.end);
    body.append("harga",this.harga);
    body.append("usePoin",this.usePoin.toString());
    body.append("satuan",this.satuan);
    body.append("durasi_id",this.durasi_id);

    this.http.post(this.serv.base_url+"booking", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();
        //console.log(data);

        if(response.status=="Success"){
          this.modalController.dismiss({
            'dismissed': true
          });

          this.navCtrl.navigateRoot('/home');
          let navigationExtras: NavigationExtras = {
            state: {
              id: response.data.id
            }
          };
          setTimeout( () => {
            this.router.navigate(['detail-booking'], navigationExtras);
          }, 800);
        }else{
          if(response.message=="Stok Homestay Kosong"){
            const alert = this.alertController.create({
              header: response.status,
              message: "Homestay Not available",
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    
                  }
                }
              ]
            }).then((res) => {
              res.present();
        
              res.onDidDismiss().then((dis) => {
                //console.log('Loading dismissed!');
              });
            });
          }else{
            const alert = this.alertController.create({
              header: response.status,
              message: "Poin yang dibutuhkan kurang, silakan lakukan topup terlebih dahulu atau gunakan metode pembayaran transfer bank",
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    
                  }
                },
                {
                  text: 'Edit Profile',
                  handler: () => {
                    this.navCtrl.navigateRoot('/tabs/tab4');
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
        
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  topup(){
    this.router.navigateByUrl('/berhasil-topup');
  }

}
