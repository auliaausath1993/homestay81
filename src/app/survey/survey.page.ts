import { LoadingController, AlertController } from '@ionic/angular';
import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, Route, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})
export class SurveyPage implements OnInit {
  loading;
  bahasa;bahasa_name;
  id;data;foto;fasilitas;

  user;
  nama;harga;ukuran_kamar;listrik;kamar_mandi;parkir;lokasi;deskripsi;catatan;

  qty = 1;
  lat;lng;

  tanggal;jam;
  whatsapp;

  SUBTITLE_BACK;
  subtitle_tentukan;
  subtitle_tanggal;
  subtitle_jam;
  button_atur;

  message_survey;

  list_jam = [];
  max_tgl;
  today;

  subtitle_form;
  
  constructor(
    private http: Http,
    private router: Router,
    private location: Location,
    private serv: MyserviceService,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) {
    //get subtitle bahasa
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
    this.storage.get('bahasa').subscribe((data) => {
      if(data){
        this.bahasa = data;
        this.storage.get('bahasa_name').subscribe((data) => {
          if(data){
            this.bahasa_name = data;
            this.getSubtitle();
            this.getData();
          }
        });
      }
    });

    //get status login user
    this.storage.get('user').subscribe((data) => {
      if(data){
        //console.log(data);
        this.user = data;
      }
    });

    //get lemparan parameter dari page sebelumnya
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.data;
        this.whatsapp = this.data.keeper.no_wa;
      }
    });
  }
  ngOnInit() {
  }
  getSubtitle(){
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      var response = data.json();
      if(this.bahasa=="id"){
        this.SUBTITLE_BACK = response.id.BACK_BUTTON;
        this.subtitle_tentukan = response.id.subtitle_tentukan;
        this.subtitle_tanggal = response.id.subtitle_tanggal;
        this.subtitle_jam = response.id.subtitle_jam;
        this.button_atur = response.id.button_atur;
        this.message_survey = response.id.message_survey;
        this.subtitle_form = response.id.subtitle_form;
      }else if(this.bahasa=="en"){
        this.SUBTITLE_BACK = response.en.BACK_BUTTON;
        this.subtitle_tentukan = response.en.subtitle_tentukan;
        this.subtitle_tanggal = response.en.subtitle_tanggal;
        this.subtitle_jam = response.en.subtitle_jam;
        this.button_atur = response.en.button_atur;
        this.message_survey = response.en.message_survey;
        this.subtitle_form = response.en.subtitle_form;
      }else if(this.bahasa=="ch"){
        this.SUBTITLE_BACK = response.ch.BACK_BUTTON;
        this.subtitle_tentukan = response.ch.subtitle_tentukan;
        this.subtitle_tanggal = response.ch.subtitle_tanggal;
        this.subtitle_jam = response.ch.subtitle_jam;
        this.button_atur = response.ch.button_atur;
        this.message_survey = response.ch.message_survey;
        this.subtitle_form = response.ch.subtitle_form;

      }
      //console.log(response);
    });
  }
  getData(){
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

    body.append("pelanggan_id",this.user.id);
    body.append("homestay_id",this.data.homestay[0].id);
    body.append("tanggal",this.tanggal);
    body.append("jam",this.jam);

    this.http.post(this.serv.base_url+"jam_survey", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();
        //console.log(data);
        if(response.status=="Success"){
          this.list_jam = response.data;
          let myDate = new Date();
          let month  = 0;
          month      = myDate.getMonth()+1;
          if(month==0){
            month = 1;
          }

          let string_month = (myDate.getMonth()+1).toString();
          if(month<10){
            string_month = "0"+month.toString();
          }
          let date : string = (myDate.getDate()).toString();
          if(parseInt(date)<10){
            date = "0"+(myDate.getDate());
          }
          let date_max : string = (myDate.getDate()).toString();
          let date_num = parseInt(date_max)+(parseInt(response.tgl.max_hari) - 1);
          date_max = date_num.toString();
          if(parseInt(date_max)<10){
            date_max = "0"+(myDate.getDate()+response.tgl.max_hari);
          }else{
            //date_max = (parseInt(date_max)+parseInt(response.tgl.max_hari)).toString();
          }

          this.today  = myDate.getFullYear()+"-"+string_month+"-"+date;
          this.max_tgl  = myDate.getFullYear()+"-"+string_month+"-"+date_max;
          console.log(myDate.getMonth());
          console.log(string_month);
          console.log(this.today);
          console.log(this.max_tgl);
        }else{
          const alert = this.alertController.create({header: response.status,message: response.message,buttons: [{text: 'Ok',handler: () => {}}]}).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
        }
        
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  survey(){
    this.tanggal  = this.tanggal.split("T")[0];
    //this.jam      = this.jam.split("T")[1];
    //this.jam      = this.jam.split(".")[0];
    //this.jam      = this.jam.split(":")[0]+":"+this.jam.split(":")[1];

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

    body.append("pelanggan_id",this.user.id);
    body.append("homestay_id",this.data.homestay[0].id);
    body.append("tanggal",this.tanggal);
    body.append("jam",this.jam);

    this.http.post(this.serv.base_url+"survey", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();
        //console.log(data);
        if(response.status=="Success"){
          const alert = this.alertController.create({
            header: response.status,
            message: response.message,
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.openWa();
          
                  //this.storage.clear();
                  //this.router.navigateByUrl("home", { skipLocationChange: true });
      
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
          if(response.reason=="form"){
            const alert = this.alertController.create({header: response.status,message: response.message+" "+this.subtitle_form,buttons: [{text: 'Ok',handler: () => {}}]}).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
          }else{
            const alert = this.alertController.create({header: response.status,message: response.message,buttons: [{text: 'Ok',handler: () => {}}]}).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
          }
        }
        
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  openWa(){
    let navigationExtras: NavigationExtras = {
      state: {
        id : this.data.homestay[0].id
      }
    };
    this.router.navigate(['/detail'], { queryParams: { id : this.data.homestay[0].id } });

    setTimeout( () => {
      
      //let oldStr = this.whatsapp;
      let oldStr = this.data.homestay[0].keeper.no_wa;
      let newStr = oldStr;
      if(oldStr.charAt(0)=="0"){
        newStr = oldStr.replace(oldStr.charAt(0), "+62");
      }

      if (('standalone' in window.navigator)) {
        var win = window.open("https://api.whatsapp.com/send?phone="+newStr+"&text=Hi, saya ingin survey "+this.data.homestay[0].nama+", "+this.data.homestay[0].jenis+", "+this.data.homestay[0].daerah.daerah+" pada "+this.tanggal+" "+this.jam, '_top');
          win.focus();
      } else {
          var win = window.open("https://api.whatsapp.com/send?phone="+newStr+"&text=Hi, saya ingin survey "+this.data.homestay[0].nama+", "+this.data.homestay[0].jenis+", "+this.data.homestay[0].daerah.daerah+" pada "+this.tanggal+" "+this.jam, '_blank');
          win.focus();
      }
      //window.open("https://api.whatsapp.com/send?phone="+newStr+"&text=Hi, saya ingin survey "+this.data.homestay[0].nama+", "+this.data.homestay[0].jenis+", "+this.data.homestay[0].daerah.daerah+" pada "+this.tanggal+" "+this.jam,"_blank");
    }, 1000);

  }
  myBackButton(){
    // this.location.back();
    let navigationExtras: NavigationExtras = {
      state: {
        id : this.data.homestay[0].id
      }
    };
    this.router.navigate(['/detail'], { queryParams: { id : this.data.homestay[0].id } });
  }
  toRp(val){
    return this.serv.toRp(val);
  }

}
