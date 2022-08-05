import { MyserviceService } from './../myservice.service';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras} from '@angular/router';
import { ToastController, LoadingController } from "@ionic/angular";
import { MenuController, Events } from '@ionic/angular';
import { Location } from '@angular/common';

import { Plugins } from '@capacitor/core';
import { map } from "rxjs/operators";

import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  lat: number = 51.678418;
  lng: number = 7.809007;

  nearest_homestay;
  pelanggan_id;
  val;

  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;

  constructor(
    private http: Http,
    private router: Router,
    private events: Events,
    private location: Location,
    private serv: MyserviceService,
    private storage: StorageMap,
    public toastController: ToastController,
    public menuCtrl: MenuController,
    private loadingController : LoadingController
    ) {

    
    }

  ngOnInit(): void {
    Plugins.Geolocation.getCurrentPosition().then(result => {
      this.lat = result.coords.latitude;
      this.lng = result.coords.longitude;
    
      this.storage.get('user').subscribe((data) => {
        if(data){
          //console.log(data);
          this.val = data;
          this.pelanggan_id = this.val.id;
          this.loadMap(this.lat,this.lng);
        }
      });
    });
  }
  ngAfterViewInit() {
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
  getData(){
    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;

    body.append("pelanggan_id",this.pelanggan_id);
    body.append("latitude",this.lat.toString());
    body.append("longitude",this.lng.toString());

    this.http.post(this.serv.base_url+"nearest_homestay", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();
        var marker = [];
        var infowindow = [];
        this.nearest_homestay = response.nearest_homestay;
        for(let x = 0;x<this.nearest_homestay.length;x++){
          marker[x] = new google.maps.Marker({
            position: new google.maps.LatLng(this.nearest_homestay[x].latitude, this.nearest_homestay[x].longitude),
            map: this.map, 
            icon: 'assets/icons/icon-15x15.png',
            title: this.nearest_homestay[x].name
          });

          infowindow[x] = new google.maps.InfoWindow();
          infowindow[x].setContent(this.nearest_homestay[x].nama);
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
  myBackButton(){
    this.location.back();
  }

}
