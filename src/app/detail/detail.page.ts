import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, Route, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CeiboShare } from 'ng2-social-share';
import { DomSanitizer } from "@angular/platform-browser";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

declare var jwplayer: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  loading;
  bahasa;bahasa_name;
  id;data;foto;fasilitas;

  user;homestay_id;
  nama;harga;ukuran_kamar;listrik;kamar_mandi;parkir;lokasi;deskripsi;catatan;

  qty = 1;
  lat;lng;
  latlong;

  whatsapp;
  base;
  base_url;

  subtitle_fasilitas;
  subtitle_ukuran;
  subtitle_listrik;
  subtitle_kamar_mandi;
  subtitle_parkir;
  subtitle_lokasi;
  subtitle_deskripsi;
  subtitle_catatan;
  subtitle_pilihdurasi;
  subtitle_kamar_penuh;

  message_booking;
  
  foto1 = null;
  foto2 = null;
  foto3 = null;
  foto4 = null;
  foto5 = null;
  list_foto = [];

  button_arah;
  button_survey;

  title_detail_kamar;
  message_belum_login;

  message_confirm_booking;
  durasi = "Month";
  list_durasi;
  form_durasi = "0";
  list_harga;

  total_harga = 0;
  total_old;

  newVariable: any;
  diskon = 0;

  video;
  waitFinish = false;

  stok = 0;
  link_video : any;

  booking_failed;

  list_picked = [];
  durasiPicked;
  
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
    private navCtrl: NavController
  ) {
    this.base           = this.serv.base_url_img;
    this.base_url       = this.serv.base_url;

    //loading dulu
    this.loading = this.loadingController.create({
      duration: 5000,
      message: 'Please Wait'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        //console.log('Loading dismissed!');
      });
    });

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
          }
        });
      }
    });

    //get status login user
    

    //get lemparan parameter dari page sebelumnya
    this.id = this.route.snapshot.paramMap.get('id');
    this.id = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = +params['id'] || 0;
        
      });

    
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        //this.id = this.router.getCurrentNavigation().extras.state.id;
      }
    });
  }

  checkPicked(data){
    if(this.list_picked.indexOf(data.id) > -1){
      return true;
    }else{
      return false;
    }
  }
  pickDurasi(data){
    if(this.list_picked.indexOf(data.id) > -1){
      let idx = this.list_picked.indexOf(data.id);
      console.log(idx);
      this.list_picked.splice(idx,1);
    }else{
      this.list_picked = [];
      this.list_picked.push(data.id);
      this.durasiPicked = data;
    }
    console.log(this.list_picked);
  }
  ngOnInit(){
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
  ionViewWillEnter(){
    setTimeout(() => {
      this.storage.get('user').subscribe((data) => {
        if(data){
          //console.log(data);
          this.user = data;
          this.getData();
        }else{
          this.getData();
        }
      });
    }, 1000);
  }
  getVideoLink(){

    setTimeout( () => {
      // let link = this.domSanitizer.bypassSecurityTrustResourceUrl("https://admin.homestay81.com/api/get_video/1579593651_SampleVideo_720x480_1mb.mp4");
      let link = this.domSanitizer.bypassSecurityTrustResourceUrl("https://admin.homestay81.com/api/get_video/"+this.video);
      console.log(link+" WOI!!!!");
      return link;
    }, 3000);
  }
  getSubtitle(){
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      var response = data.json();
      if(this.bahasa=="id"){
        this.subtitle_fasilitas     = response.id.subtitle_fasilitas;
        this.subtitle_ukuran        = response.id.subtitle_ukuran;
        this.subtitle_listrik       = response.id.subtitle_listrik;
        this.subtitle_kamar_mandi   = response.id.subtitle_kamar_mandi;
        this.subtitle_parkir        = response.id.subtitle_parkir;
        this.subtitle_lokasi        = response.id.subtitle_lokasi;
        this.subtitle_deskripsi     = response.id.subtitle_deskripsi;
        this.subtitle_catatan       = response.id.subtitle_catatan;
        this.subtitle_pilihdurasi   = response.id.subtitle_pilihdurasi;
        this.message_booking        = response.id.message_booking;
        this.button_arah            = response.id.button_arah;
        this.button_survey          = response.id.button_survey;
        this.title_detail_kamar     = response.id.title_detail_kamar;
        this.message_belum_login    = response.id.message_belum_login;
        this.message_confirm_booking= response.id.message_confirm_booking;
        this.subtitle_kamar_penuh   = response.id.subtitle_kamar_penuh;
        this.booking_failed         = response.id.booking_failed;
      }else if(this.bahasa=="en"){
        this.subtitle_fasilitas     = response.en.subtitle_fasilitas;
        this.subtitle_ukuran        = response.en.subtitle_ukuran;
        this.subtitle_listrik       = response.en.subtitle_listrik;
        this.subtitle_kamar_mandi   = response.en.subtitle_kamar_mandi;
        this.subtitle_parkir        = response.en.subtitle_parkir;
        this.subtitle_lokasi        = response.en.subtitle_lokasi;
        this.subtitle_deskripsi     = response.en.subtitle_deskripsi;
        this.subtitle_catatan       = response.en.subtitle_catatan;
        this.subtitle_pilihdurasi   = response.en.subtitle_pilihdurasi;
        this.message_booking        = response.en.message_booking;
        this.button_arah            = response.en.button_arah;
        this.button_survey          = response.en.button_survey;
        this.title_detail_kamar     = response.en.title_detail_kamar;
        this.message_belum_login    = response.en.message_belum_login;
        this.message_confirm_booking= response.en.message_confirm_booking;
        this.subtitle_kamar_penuh   = response.en.subtitle_kamar_penuh;
        this.booking_failed         = response.en.booking_failed;
      }else if(this.bahasa=="ch"){
        this.subtitle_fasilitas     = response.ch.subtitle_fasilitas;
        this.subtitle_ukuran        = response.ch.subtitle_ukuran;
        this.subtitle_listrik       = response.ch.subtitle_listrik;
        this.subtitle_kamar_mandi   = response.ch.subtitle_kamar_mandi;
        this.subtitle_parkir        = response.ch.subtitle_parkir;
        this.subtitle_lokasi        = response.ch.subtitle_lokasi;
        this.subtitle_deskripsi     = response.ch.subtitle_deskripsi;
        this.subtitle_catatan       = response.ch.subtitle_catatan;
        this.subtitle_pilihdurasi   = response.ch.subtitle_pilihdurasi;
        this.message_booking        = response.ch.message_booking;
        this.button_arah            = response.ch.button_arah;
        this.button_survey          = response.ch.button_survey;
        this.title_detail_kamar     = response.ch.title_detail_kamar;
        this.message_belum_login    = response.ch.message_belum_login;
        this.message_confirm_booking= response.ch.message_confirm_booking;
        this.subtitle_kamar_penuh   = response.ch.subtitle_kamar_penuh;
        this.booking_failed         = response.ch.booking_failed;
      }
      //console.log(response);
    });
  }
  getData(){
    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;

    body.append("id",this.id);
    if(this.user){
      body.append("pelanggan_id",this.user.id);
    }

    this.http.post(this.serv.base_url+"detail_homestay", body, requestOptions)
    .subscribe(data => {
        this.waitFinish = true;
        this.loadingController.dismiss();
        //console.log(data);
        var response = data.json();

        this.data = response;
        this.fasilitas = response.fasilitas;
        this.homestay_id = response.homestay[0].id;
        this.foto = response.homestay[0].foto;
        this.foto1 = response.homestay[0].foto1;
        this.foto2 = response.homestay[0].foto2;
        this.foto3 = response.homestay[0].foto3;
        this.foto4 = response.homestay[0].foto4;
        this.foto5 = response.homestay[0].foto5;
        this.video = response.homestay[0].video;
        if(this.video==""){
          this.waitFinish = false;
        }
        this.stok  = response.homestay[0].stok;
        if(response.homestay[0].foto!=null){
          this.list_foto.push(response.homestay[0].foto);
        }
        if(response.homestay[0].foto1!=null){
          this.list_foto.push(response.homestay[0].foto1);
        }
        if(response.homestay[0].foto2!=null){
          this.list_foto.push(response.homestay[0].foto2);
        }
        if(response.homestay[0].foto3!=null){
          this.list_foto.push(response.homestay[0].foto3);
        }
        if(response.homestay[0].foto4!=null){
          this.list_foto.push(response.homestay[0].foto4);
        }
        if(response.homestay[0].foto5!=null){
          this.list_foto.push(response.homestay[0].foto5);
        }
        this.list_foto = response.homestay[0].list_foto;
        //this.whatsapp = response.keeper.no_wa;
        this.whatsapp = response.homestay[0].keeper.no_wa;

        this.nama = response.homestay[0].nama;
        this.harga = response.homestay[0].harga;
        this.total_harga = response.homestay[0].harga;
        this.total_old = response.homestay[0].harga;


        let link_video = this.base+"vector/upload/"+response.homestay[0].video;
        link_video = "https://admin.homestay81.com/api/get_video/"+response.homestay[0].video;
        //this.link_video = this.domSanitizer.bypassSecurityTrustResourceUrl("https://admin.homestay81.com/api/get_video/"+response.homestay[0].video+"");
        this.link_video = this.domSanitizer.bypassSecurityTrustResourceUrl("https://admin.homestay81.com/api/iframe_video/"+response.homestay[0].video+"");        console.log(this.link_video);
        // setTimeout( () => {
        //   jwplayer('player').setup({
        //     file: link_video,
        //     aspectratio: '16:9',
        //     mute: false,
        //     autostart: false,
        //     primary: 'html5',
        //     provider: 'video',
        //     volume: 100,
        //   });
        // }, 5000);
        // setTimeout( () => {
        //   jwplayer('player2').setup({
        //     file: "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
        //     aspectratio: '16:9',
        //     mute: false,
        //     autostart: false,
        //     primary: 'html5',
        //     provider: 'video',
        //     volume: 100,
        //   });
        // }, 5000);

        this.ukuran_kamar = response.homestay[0].ukuran_kamar;
        this.listrik = response.homestay[0].listrik;
        this.kamar_mandi = response.homestay[0].kamar_mandi;
        this.parkir = response.homestay[0].parkir;
        this.lokasi = response.homestay[0].lokasi;
        this.deskripsi = response.homestay[0].deskripsi;
        this.catatan = response.homestay[0].catatan;
        this.lat = response.homestay[0].latitude;
        this.lng = response.homestay[0].longitude;
        this.latlong = response.homestay[0].latlong;

        //this.durasi = response.homestay[0].durasi.durasi;
        this.list_harga = response.homestay[0].list_harga;
        
        let dur   = {"id":"0","durasi":"bulan"};
        let bulan = {"durasi_id":"0","harga":this.harga,"homestay_id":this.id,"id":"0","durasi":dur};
        this.list_harga.push(bulan)
        console.log(this.list_harga);



        this.diskon = response.pelanggan[0].diskon;
        if(this.diskon!=0 || this.diskon!=undefined){
          //this.total_harga = this.total_harga - ((this.diskon/100)*100);
        }

        //console.log(this.list_foto);
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  openWa(){
    let oldStr = this.whatsapp;
    let newStr = oldStr;
    if(oldStr.charAt(0)=="0"){
      newStr = oldStr.replace(oldStr.charAt(0), "+62");
    }
    //window.open("https://api.whatsapp.com/send?phone="+newStr,"_blank");
    window.location.assign("https://api.whatsapp.com/send?phone="+newStr);
  }
  navigasi(){
    //window.open("http://maps.google.com/maps?daddr="+this.lat+","+this.lng+"","_blank");
    window.open("http://maps.google.com/maps?daddr="+this.latlong,"_blank");
  }
  popup(foto){
    console.log("popup "+foto);
    let navigationExtras: NavigationExtras = {
      state: {
        id: this.id,
        foto : this.foto,
        list_foto : this.list_foto
      }
    };
    this.router.navigate(['popup-image'], navigationExtras);
  }
  survey(){
    if(this.stok==0){
      const alert = this.alertController.create({
        message: this.subtitle_kamar_penuh,
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
      this.doSurvey();
    }
  }
  doSurvey(){
    //this.router.navigateByUrl('/survey');
    if(this.user){
      let navigationExtras: NavigationExtras = {
        state: {
          data : this.data
        }
      };
      this.router.navigate(['survey'], navigationExtras);
    }else{
      const alert = this.alertController.create({
        header: '',
        message: this.message_belum_login,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          }, {
            text: 'Ok',
            handler: () => {
      
              this.storage.clear();
              let navigationExtras: NavigationExtras = {
                state: {
                  id : this.data.id
                }
              };
              this.router.navigate(['login'], navigationExtras);
  
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
  goToBookingPage(){ 
    if(this.user){
      console.log({
        state: {
          data : this.data, 
          list_harga : this.list_harga, 
          durasi: this.durasiPicked
        }
      });
      
      let navigationExtras: NavigationExtras = {
        state: {
          data : this.data, 
          list_harga : this.list_harga, 
          durasi: this.durasiPicked
        }
      };
      this.router.navigate(['booking-room'], navigationExtras);
    }else{
      const alert = this.alertController.create({
        header: '',
        message: this.message_belum_login,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          }, {
            text: 'Ok',
            handler: () => {
      
              this.storage.clear();
              let navigationExtras: NavigationExtras = {
                state: {
                  id : this.data.id
                }
              };
              this.router.navigate(['login'], navigationExtras);
              //this.router.navigateByUrl("login", { skipLocationChange: true });
  
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
    
    //this.router.navigate(['/booking-room'], { queryParams: { data : data, durasi: this.durasiPicked } });
  }
  booking(){
    if(this.user){
      const alert = this.alertController.create({
        header: '',
        message: this.message_confirm_booking,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          }, {
            text: 'Ok',
            handler: () => {
              this.doBooking();
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
        header: '',
        message: this.message_belum_login,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          }, {
            text: 'Ok',
            handler: () => {
      
              this.storage.clear();
              let navigationExtras: NavigationExtras = {
                state: {
                  id : this.data.id
                }
              };
              this.router.navigate(['login'], navigationExtras);
              //this.router.navigateByUrl("login", { skipLocationChange: true });
  
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
    //this.router.navigateByUrl('/berhasil');
  }
  doBookingx(){
    let total_baru = 0;
    if(this.diskon!=0 || this.diskon!=undefined){
      total_baru = this.total_harga - ((this.diskon/100)*this.total_harga);
    }
    console.log(total_baru);
  }
  doBooking(){
    let total_baru = 0;
    let nominal_diskon = 0;
    if(this.diskon!=0 || this.diskon!=undefined){
      total_baru = this.total_harga - ((this.diskon/100)*this.total_harga);
      nominal_diskon = (this.diskon/100)*this.total_harga;
    }
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
    body.append("homestay_id",this.homestay_id);
    body.append("total",(total_baru).toString() );
    body.append("diskon",(nominal_diskon).toString() );
    body.append("durasi",this.qty.toString());

    let satuan = this.form_durasi.split("#")[1];
    body.append("satuan",satuan);

    let durasi_id = this.form_durasi.split("#")[0];
    body.append("durasi_id",durasi_id);

    this.http.post(this.serv.base_url+"booking", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();
        //console.log(data);

        if(response.status=="Success"){

          this.navCtrl.navigateRoot('/home');
          let navigationExtras: NavigationExtras = {
            state: {
              id: response.data.id
            }
          };
          setTimeout( () => {
            this.router.navigate(['detail-booking'], navigationExtras);
          }, 800);

          // const alert = this.alertController.create({
          //   header: response.status,
          //   message: this.message_booking,
          //   buttons: [
          //     {
          //       text: 'Ok',
          //       handler: () => {
          
          //         // let navigationExtras: NavigationExtras = {
          //         //   state: {
          //         //     data : response.data
          //         //   }
          //         // };
          //         // this.router.navigate(['berhasil'], navigationExtras);


          //         this.navCtrl.navigateRoot('/home');
          //         let navigationExtras: NavigationExtras = {
          //           state: {
          //             id: response.data.id
          //           }
          //         };
          //         setTimeout( () => {
          //           this.router.navigate(['detail-booking'], navigationExtras);
          //         }, 800);
      
          //       }
          //     }
          //   ]
          // }).then((res) => {
          //   res.present();
      
          //   res.onDidDismiss().then((dis) => {
          //     //console.log('Loading dismissed!');
          //   });
          // });
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
              message: this.booking_failed,
              buttons: [
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
  share(){
    this.newVariable = window.navigator;
    console.log("share?");
    if (this.newVariable.share) {
      this.newVariable.share({
        title: 'Homestay81',
        text: 'Homestay81',
        url: 'https://homestay81.com/detail?id='+this.id,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }else{
      //alert("Share not supported");
      this.socialSharing.share('https://homestay81.com/detail?id='+this.id, this.nama, null, 'https://homestay81.com/detail?id='+this.id);
    }
  }
  onChange(evt){
    let val = evt.detail.value;
    let split = val.split("#");
    console.log(split);
    if(val!="0"){
      let disc = (this.diskon/100)*split[2];
      console.log(this.total_harga);
      console.log(disc);
      this.total_harga = this.qty*(split[2]);
    }else{
      this.total_harga = this.total_old;
    }
  }
  kurang(){
    if(this.qty>1)
    this.qty -= 1;
    let val = this.form_durasi;
    if(val!="0"){
      let split = val.split("#");
      this.total_harga = this.qty*parseInt(split[2]) - (this.diskon/100*parseInt(split[2])) ;
    }else{
      this.total_harga = this.qty*this.total_old;
    }
  }
  tambah(){
    this.qty += 1;
    let val = this.form_durasi;
    if(val!="0"){
      let split = val.split("#");
      this.total_harga = this.qty*parseInt(split[2]) - (this.diskon/100*parseInt(split[2]));
    }else{
      this.total_harga = this.qty*this.total_old;
    }
  }
  backToHome(){
    this.router.navigateByUrl('/home');
  }
  myBackButton(){
    this.location.back();
  }
  toRp(val){
    return this.serv.toRp(val);
  }

}