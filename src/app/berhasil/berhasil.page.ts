import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ModalController, NavParams, NavController } from '@ionic/angular';

@Component({
  selector: 'app-berhasil',
  templateUrl: './berhasil.page.html',
  styleUrls: ['./berhasil.page.scss'],
})
export class BerhasilPage implements OnInit {
  bahasa;bahasa_name;
  data;kode_booking;expired;total;countdown;
  collection = [1,1,1,1,1,1,1,1];

  timer;

  subtitle_lakukan_pembayaran;
  btn_detail_pesanan;
  subtitle_back;
  
  constructor(
    private http: Http,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private serv: MyserviceService,
    private modalController: ModalController,
    private navCtrl: NavController,
    private storage: StorageMap
  ) {
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

    //get lemparan parameter dari page sebelumnya
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.data;

        this.kode_booking = this.data.kode_booking;
        this.expired      = this.data.expired.date;
        this.total        = this.data.total;

        this.setupCountdown();
        
        // let ar            = this.expired.split(" ");
        // let ar2           = ar[1].split(".");
        // this.countdown    = ar2[0];
      }
    });
  }
  ngOnInit() {
  }
  getSubtitle(){
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      var response = data.json();
      if(this.bahasa=="id"){
        this.subtitle_lakukan_pembayaran  = response.id.subtitle_lakukan_pembayaran;
        this.btn_detail_pesanan           = response.id.btn_detail_pesanan;
        this.subtitle_back                = response.id.subtitle_back;
      }else if(this.bahasa=="en"){
        this.subtitle_lakukan_pembayaran  = response.en.subtitle_lakukan_pembayaran;
        this.btn_detail_pesanan           = response.en.btn_detail_pesanan;
        this.subtitle_back                = response.en.subtitle_back;
      }else if(this.bahasa=="ch"){
        this.subtitle_lakukan_pembayaran  = response.ch.subtitle_lakukan_pembayaran;
        this.btn_detail_pesanan           = response.ch.btn_detail_pesanan;
        this.subtitle_back                = response.ch.subtitle_back;
      }
      //console.log(response);
    });
  }
  goToDetail(){
    this.closeModal();
    this.navCtrl.navigateRoot('/home');
    let navigationExtras: NavigationExtras = {
      state: {
        id: this.data.id
      }
    };
    setTimeout( () => {
      this.router.navigate(['detail-booking'], navigationExtras);
    }, 800);
  }

  setupCountdown(){
    var compareDate = new Date();
    compareDate.setDate(this.expired);
    let self = this;
    this.timer = setInterval(function() {
      self.timeBetweenDates(compareDate);
    }, 2000);
  }
  timeBetweenDates(toDate) {
    let stringDate : string = this.expired;
    toDate = new Date(stringDate.replace(/-/g,"/"));

    var dateEntered = toDate;
    var now = new Date();
    var difference = dateEntered.getTime() - now.getTime();

    this.expired = this.expired.split(".")[0];
    stringDate = stringDate.split(".")[0];
    console.log(this.expired);
    console.log(stringDate);
    console.log(toDate);
    console.log(now);
    console.log("diff "+difference);

    if (difference <= 0) {

      // Timer done
      clearInterval(this.timer);
    
    } else {
      
      var seconds = Math.floor(difference / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);

      hours %= 24;
      minutes %= 60;
      seconds %= 60;

      this.countdown = hours+":"+minutes+":"+seconds;
    }
  }
  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }
  booking(){
    this.router.navigateByUrl('/home');
  }
  toRp(val){
    return this.serv.toRp(val);
  }
  myBackButton(){
    this.location.back();
  }

}
