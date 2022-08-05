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
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  date: string;
  type: 'string';

  list_fasilitas = [];
  list = [1,1,1,1,1];

  data;
  val : any;
  pelanggan_id;user;
  
  constructor(
    private http: Http,
    private router: Router,
    private storage: StorageMap,
    private serv: MyserviceService,
    private loadingController : LoadingController,
  ) {
    this.storage.get('user').subscribe((data) => {
      console.log(data);
      if(data){
        console.log(data);
        this.val = data;
        this.pelanggan_id = this.val.id;
        this.getData();
      }
    });
  }

  ngOnInit() {
  }
  getData(){
    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;
    body.append("pelanggan_id",this.val.id);
    this.http.post(this.serv.base_url+"get_notification", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        console.log(data);
        var response  = data.json();
        this.data = response.data;
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  backToHome(){
    this.router.navigateByUrl('/home');
  }
  /**
   * @author Nazor
   * @param bookingId string
   * @param homestayId string
   *  */
  goToBookingPage(bookingId: string, homestayId: string){
    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;

    body.append("id", homestayId);
    if(this.user){
      body.append("pelanggan_id",this.user.id);
    }

    this.http.post(this.serv.base_url+"detail_homestay", body, requestOptions)
    .subscribe(res => {
      var response = res.json();
      console.log(response);
      var data = response;
      var fasilitas = response.fasilitas;
      var list_harga = response.homestay[0].list_harga;
      
      let navigationExtras: NavigationExtras = {
        state: {
          data, 
          list_harga, 
          durasi: null
        }
      };
      this.router.navigate(['booking-room'], navigationExtras);
    })
  }
}
