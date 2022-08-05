
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { MyserviceService } from './../myservice.service';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, Route, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CeiboShare } from 'ng2-social-share';
import { DomSanitizer } from "@angular/platform-browser";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-booking-popup',
  templateUrl: './booking-popup.page.html',
  styleUrls: ['./booking-popup.page.scss'],
})
export class BookingPopupPage implements OnInit {
  loading;
  nominal;
  kamar;
  jumlah_room;

  @Input() firstName: string;
  @Input() lastName: string;
  @Input() middleInitial: string;

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
  @Input("jumlah_kamar") jumlah_kamar: string;;
  
  constructor(
    private http: Http,
    private router: Router,
    private location: Location,
    private serv: MyserviceService,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private socialSharing: SocialSharing,
    private navCtrl: NavController,
    private modalController: ModalController,
  ) { 
  }

  ngOnInit() {
    console.log(this.pelanggan_id);
    console.log(this.homestay_id);
    console.log(this.homestay);
    console.log(this.total);
    console.log(this.diskon);
    console.log(this.durasi);
    console.log(this.tanggal);
    console.log(this.end);
    console.log(this.harga);
    console.log(this.usePoin);
    console.log(this.satuan);
    console.log(this.durasi_id);
    console.log(this.jumlah_kamar);

    this.nominal = this.durasi+" "+this.satuan;
    this.jumlah_room = this.jumlah_kamar;
    this.kamar   = this.homestay;
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  doBooking(){
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
    body.append("start",this.tanggal);
    body.append("end",this.end);
    body.append("harga",this.harga);
    body.append("usePoin",this.usePoin.toString());
    body.append("satuan",this.satuan);
    body.append("durasi_id",this.durasi_id);
    body.append("jumlah_kamar",this.jumlah_kamar);

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
              message: response.message,
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

}
