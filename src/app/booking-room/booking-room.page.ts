import { BookingRoomTermsPage } from './../booking-room-terms/booking-room-terms.page';
import { BookingPopupPage } from './../booking-popup/booking-popup.page';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, Route, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CeiboShare } from 'ng2-social-share';
import { DomSanitizer } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController } from '@ionic/angular';
import { PopupCalendarPage } from '../popup-calendar/popup-calendar.page';
import { PopCalendar2Page } from '../pop-calendar2/pop-calendar2.page';
import { ToastController } from '@ionic/angular';

declare var jwplayer: any;

@Component({
  selector: 'app-booking-room',
  templateUrl: './booking-room.page.html',
  styleUrls: ['./booking-room.page.scss'],
})
export class BookingRoomPage implements OnInit {
  loading;
  bahasa; bahasa_name;
  id; data; foto; fasilitas;

  user; homestay_id;
  nama; harga; ukuran_kamar; listrik; kamar_mandi; parkir; lokasi; deskripsi; catatan;

  qty = 1;
  lat; lng;
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

  message_confirm_booking; durasi;
  list_durasi; form_durasi = '0';
  list_harga;

  total_harga = 0;
  total_old;

  newVariable: any;
  diskon = 0;

  video;
  waitFinish = false;

  stok = 0;
  link_video: any;

  booking_failed;

  list_picked = [];
  durasiPicked;

  today; checkin; checkout;
  count = 1;
  nama_durasi = '';

  usePoin = false;
  poin = 0;
  agree = false;

  jumlah_kamar = 1;

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
    public toastController: ToastController,
  ) {
    this.base           = this.serv.base_url_img;
    this.base_url       = this.serv.base_url;

    // console.log('tanggal : ' + this.serv.tgl);
    if (this.serv.tgl !== '-') {
      this.today = this.serv.tgl;
    }

    setTimeout(() => {
      this.storage.get('user').subscribe((data) => {
        if (data) {
          // console.log(data);
          this.user = data;
        } else {
        }
      });
    }, 1000);

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    this.today = yyyy + '-' + mm + '-' + dd;
    this.checkout = yyyy + '-' + mm + '-' + dd;

    this.route.queryParams.subscribe(params => {
      // console.log(params);
      // console.log('state');
      // console.log(this.router.getCurrentNavigation().extras.state);
      if (this.router.getCurrentNavigation().extras.state) {
        this.data        = this.router.getCurrentNavigation().extras.state.data;
        this.list_durasi = this.router.getCurrentNavigation().extras.state.durasi;
        this.list_harga  = this.router.getCurrentNavigation().extras.state.list_harga;
        const duration = this.list_harga.find(list => list.durasi.durasi === 'Hari');
        console.log('data', this.data);
        console.log('duration', duration);
        if (this.data.pelanggan.length) this.diskon = this.data.pelanggan[0].diskon
        if (Object.prototype.hasOwnProperty.call(this.data.pelanggan, 'diskon')) this.diskon = this.data.pelanggan.diskon
        if (duration) {
          this.pickDurasi(duration);
        }
        // this.durasiPicked = this.router.getCurrentNavigation().extras.state.durasi;
        // this.harga        = this.data.homestay[0].harga;


        // this.list_picked.push(this.router.getCurrentNavigation().extras.state.durasi.id);
        // this.nama_durasi = this.router.getCurrentNavigation().extras.state.durasi.durasi.durasi;
        // if(this.router.getCurrentNavigation().extras.state.durasi.durasi.durasi=="bulan"){
        //   var plus = new Date();
        //   plus.setDate(plus.getDate() + 30);
        //   var dd = String(plus.getDate()).padStart(2, '0');
        //   var mm = String(plus.getMonth() + 1).padStart(2, '0'); //January is 0!
        //   var yyyy = plus.getFullYear();
        //   this.checkout = yyyy+"-"+mm+"-"+dd;
        // }else if(this.router.getCurrentNavigation().extras.state.durasi.durasi.durasi=="Minggu"){
        //   var plus = new Date();
        //   plus.setDate(plus.getDate() + 7);
        //   var dd = String(plus.getDate()).padStart(2, '0');
        //   var mm = String(plus.getMonth() + 1).padStart(2, '0'); //January is 0!
        //   var yyyy = plus.getFullYear();
        //   this.checkout = yyyy+"-"+mm+"-"+dd;
        // }else if(this.router.getCurrentNavigation().extras.state.durasi.durasi.durasi=="Hari"){
        //   var plus = new Date();
        //   plus.setDate(plus.getDate() + 1);
        //   var dd = String(plus.getDate()).padStart(2, '0');
        //   var mm = String(plus.getMonth() + 1).padStart(2, '0'); //January is 0!
        //   var yyyy = plus.getFullYear();
        //   this.checkout = yyyy+"-"+mm+"-"+dd;
        // }
        // this.harga = this.router.getCurrentNavigation().extras.state.durasi.harga;

        // console.log(this.data);
        // console.log(this.list_durasi);
        // console.log(this.today+" "+this.checkout);
        // console.log(this.router.getCurrentNavigation().extras.state.durasi.durasi.durasi);
      }
    });

    // console.log('harga : ' + this.harga);
    if (this.harga === undefined) {
      this.harga = 0;
    }

    // loading dulu
    // this.loading = this.loadingController.create({
    //   duration: 5000,
    //   message: 'Please Wait'
    // }).then((res) => {
    //   res.present();

    //   res.onDidDismiss().then((dis) => {
    //     //console.log('Loading dismissed!');
    //   });
    // });

    // get subtitle bahasa
    this.bahasa       = this.serv.bahasa;
    this.bahasa_name  = this.serv.bahasa_name;
    this.storage.get('bahasa').subscribe((data) => {
      if (data) {
        this.bahasa = data;
        this.storage.get('bahasa_name').subscribe((data) => {
          if (data) {
            this.bahasa_name = data;
            this.getSubtitle();
          }
        });
      }
    });

    // get status login user


    // get lemparan parameter dari page sebelumnya
    this.id = this.route.snapshot.paramMap.get('id');
    this.id = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = +params.id || 0;

      });


    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        // this.id = this.router.getCurrentNavigation().extras.state.id;
      }
    });
  }

  checkPicked(data) {
    // console.log(data);
    if (this.list_picked.indexOf(data.id) > -1) {
      return true;
    } else {
      return false;
    }
  }
  onChangeDate(event) {
    console.log(event);
    const val = event.detail.value;
    const tgl = val.split('T');
    const dte = tgl[0];

    console.log(this.durasiPicked);
    if (this.durasiPicked.durasi.durasi === 'bulan') {
      const plus = new Date(dte);
      console.log(plus);
      plus.setDate(plus.getDate() + 30);
      const dd = String(plus.getDate()).padStart(2, '0');
      const mm = String(plus.getMonth() + 1).padStart(2, '0'); // January is 0!
      const yyyy = plus.getFullYear();
      this.checkout = yyyy + '-' + mm + '-' + dd;
    } else if (this.durasiPicked.durasi.durasi === 'Minggu') {
      const plus = new Date(dte);
      console.log(plus);
      plus.setDate(plus.getDate() + 7);
      const dd = String(plus.getDate()).padStart(2, '0');
      const mm = String(plus.getMonth() + 1).padStart(2, '0'); // January is 0!
      const yyyy = plus.getFullYear();
      this.checkout = yyyy + '-' + mm + '-' + dd;
    } else if (this.durasiPicked.durasi.durasi === 'Hari') {
      const plus = new Date(dte);
      console.log(plus);
      plus.setDate(plus.getDate() + 1);
      const dd = String(plus.getDate()).padStart(2, '0');
      const mm = String(plus.getMonth() + 1).padStart(2, '0'); // January is 0!
      const yyyy = plus.getFullYear();
      this.checkout = yyyy + '-' + mm + '-' + dd;
    }
  }

  durationPicked:any = {};
  pickDurasi(data) {
    this.durasiPicked = data;
    this.harga = data.harga;
    console.log('pickDurasi', this.durasiPicked);
    this.count = 1;
    if (this.list_picked.indexOf(data.id) > -1) {
      const idx = this.list_picked.indexOf(data.id);
      console.log(idx);
      // this.list_picked.splice(idx,1);
    } else {
      this.list_picked = [];
      this.list_picked.push(data.id);
      this.durasiPicked = data;

      this.nama_durasi = data.durasi.durasi;
      if (data.durasi.durasi === 'bulan') {
        const plus = new Date(this.today);
        plus.setDate(plus.getDate() + 30);
        const dd = String(plus.getDate()).padStart(2, '0');
        const mm = String(plus.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = plus.getFullYear();
        this.checkout = yyyy + '-' + mm + '-' + dd;
      } else if (data.durasi.durasi === 'Minggu') {
        const plus = new Date(this.today);
        plus.setDate(plus.getDate() + 7);
        const dd = String(plus.getDate()).padStart(2, '0');
        const mm = String(plus.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = plus.getFullYear();
        this.checkout = yyyy + '-' + mm + '-' + dd;
      } else if (data.durasi.durasi === 'Hari') {
        const plus = new Date(this.today);
        plus.setDate(plus.getDate() + 1);
        const dd = String(plus.getDate()).padStart(2, '0');
        const mm = String(plus.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = plus.getFullYear();
        this.checkout = yyyy + '-' + mm + '-' + dd;
      }
    }
    // console.log(this.list_picked);
  }
  ngOnInit() {
  }
  ionViewWillEnter() {
    setTimeout(() => {
      this.storage.get('user').subscribe((data) => {
        if (data) {
          // console.log(data);
          this.user = data;
          this.getData();
        } else {
          this.getData();
        }
      });
    }, 1000);
  }
  getVideoLink() {

    setTimeout( () => {
      // let link = this.domSanitizer.bypassSecurityTrustResourceUrl("https://admin.homestay81.com/api/get_video/1579593651_SampleVideo_720x480_1mb.mp4");
      const link = this.domSanitizer.bypassSecurityTrustResourceUrl('https://admin.homestay81.com/api/get_video/' + this.video);
      console.log(link + ' WOI!!!!');
      return link;
    }, 3000);
  }
  getSubtitle() {
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      const response = data.json();
      if (this.bahasa === 'id') {
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
        this.message_confirm_booking = response.id.message_confirm_booking;
        this.subtitle_kamar_penuh   = response.id.subtitle_kamar_penuh;
        this.booking_failed         = response.id.booking_failed;
      } else if (this.bahasa === 'en') {
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
        this.message_confirm_booking = response.en.message_confirm_booking;
        this.subtitle_kamar_penuh   = response.en.subtitle_kamar_penuh;
        this.booking_failed         = response.en.booking_failed;
      } else if (this.bahasa === 'ch') {
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
        this.message_confirm_booking = response.ch.message_confirm_booking;
        this.subtitle_kamar_penuh   = response.ch.subtitle_kamar_penuh;
        this.booking_failed         = response.ch.booking_failed;
      }
      // console.log(response);
    });
  }
  getData() {
    const headers = new Headers();
    headers.append('x-api-key', this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData;

    body.append('id', this.id);
    if (this.user) {
      body.append('pelanggan_id', this.user.id);
    }

    this.http.post(this.serv.base_url + 'get_profile', body, requestOptions)
    .subscribe(data => {
        this.waitFinish = true;
        this.loadingController.dismiss();
        // console.log(data);
        const response  = data.json();

        // this.data     = response;
        this.poin     = response.data[0].poin;
      }, error => {
        this.loadingController.dismiss();
        // console.log(error);
    });
  }
  openWa() {
    const oldStr = this.whatsapp;
    let newStr = oldStr;
    if (oldStr.charAt(0) === '0') {
      newStr = oldStr.replace(oldStr.charAt(0), '+62');
    }
    // window.open("https://api.whatsapp.com/send?phone="+newStr,"_blank");
    window.location.assign('https://api.whatsapp.com/send?phone=' + newStr);
  }
  navigasi() {
    // window.open("http://maps.google.com/maps?daddr="+this.lat+","+this.lng+"","_blank");
    window.open('http://maps.google.com/maps?daddr=' + this.latlong, '_blank');
  }
  popup(foto) {
    console.log('popup ' + foto);
    const navigationExtras: NavigationExtras = {
      state: {
        id: this.id,
        foto : this.foto,
        list_foto : this.list_foto
      }
    };
    this.router.navigate(['popup-image'], navigationExtras);
  }
  survey() {
    if (this.stok === 0) {
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
          // console.log('Loading dismissed!');
        });
      });
    } else {
      this.doSurvey();
    }
  }
  doSurvey() {
    // this.router.navigateByUrl('/survey');
    if (this.user) {
      const navigationExtras: NavigationExtras = {
        state: {
          data : this.data
        }
      };
      this.router.navigate(['survey'], navigationExtras);
    } else {
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
              const navigationExtras: NavigationExtras = {
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
          // console.log('Loading dismissed!');
        });
      });
    }
  }
  goToTerms() {
    this.router.navigate(['/terms'], { queryParams: {  } });
  }
  goToTermsBookingPage(data) {
    const navigationExtras: NavigationExtras = {
      state: {
        id : data,

      }
    };
    // this.router.navigate(['detail'], navigationExtras);
    this.router.navigate(['/booking-room-terms'], { queryParams: { id : data, durasi: this.durasiPicked } });
  }
  goToBookingPage(data) {
    const navigationExtras: NavigationExtras = {
      state: {
        id : data,

      }
    };
    // this.router.navigate(['detail'], navigationExtras);
    this.router.navigate(['/booking-room'], { queryParams: { id : data, durasi: this.durasiPicked } });
  }

  async bookingTerms() {
    const loading = await this.loadingController.create();
    await loading.present();
    const headers = new Headers();
    headers.append('x-api-key', this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const [{ id }] = this.data.homestay;
    const url = `${this.serv.base_url}check-available-homestay/${id}`;
    const body = {
      check_in: this.today,
      check_out: this.checkout,
      qty: this.jumlah_kamar,
    };
    this.http.post(url, body, requestOptions).subscribe(async data => {
      await loading.dismiss();
      const response = data.json();
      if (!response.is_available) {
        alert('Stock not available');
      } else {
        this.goBookingTerms();
      }
    }, () => loading.dismiss());
  }
  async goBookingTerms() {
    let total_baru = 0;
    let nominal_diskon = 0;
    this.total_harga = this.harga * this.count * this.jumlah_kamar;
    if (this.diskon !== 0 || this.diskon !== undefined) {
      total_baru = this.total_harga - ((this.diskon / 100) * this.total_harga);
      nominal_diskon = (this.diskon / 100) * this.total_harga;
    }
    const satuan = this.durasiPicked.durasi.durasi;
    const durasi_id = this.durasiPicked.durasi_id;
    console.log([nominal_diskon, this.diskon, this.total_harga]);
    
    const modal = await this.modalController.create({
      component: BookingRoomTermsPage,
      mode: 'ios',
      showBackdrop: true,
      componentProps: {
        pelanggan_id  : this.user.id,
        homestay_id   : this.data.homestay[0].id,
        homestay      : this.data.homestay[0].nama,
        total         : total_baru.toString(),
        diskon        : (nominal_diskon).toString(),
        durasi        : this.count.toString(),
        tanggal       : this.today,
        end           : this.checkout,
        harga         : this.harga,
        usePoin       : this.usePoin,
        satuan,
        durasi_id,
        jumlah_kamar  : this.jumlah_kamar
      }
    });
    // return await modal.present();
    const navigationExtras: NavigationExtras = {
      state: {
        pelanggan_id  : this.user.id,
        homestay_id   : this.data.homestay[0].id,
        homestay      : this.data.homestay[0].nama,
        total         : total_baru.toString(),
        diskon        : (nominal_diskon).toString(),
        durasi        : this.count.toString(),
        tanggal       : this.today,
        end           : this.checkout,
        harga         : this.harga,
        usePoin       : this.usePoin,
        satuan,
        durasi_id,
        jumlah_kamar  : this.jumlah_kamar
      }
    };
    this.router.navigate(['booking-room-terms'], navigationExtras);
  }
  async popupCalendar() {
    const modal = await this.modalController.create({
      component: PopupCalendarPage,
      mode: 'ios',
      showBackdrop: true,
      componentProps: {
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.today = dataReturned.data;
        const plus = new Date(this.today);
        if(this.durasiPicked.durasi.durasi == 'Hari') {
          plus.setDate(plus.getDate() + this.count);
        } else if(this.durasiPicked.durasi.durasi == 'Minggu') {
          plus.setDate(plus.getDate() + (this.count * 7));
        } else if(this.durasiPicked.durasi.durasi == 'bulan') {
          plus.setMonth(plus.getMonth() + this.count);
        }
        const dd = String(plus.getDate()).padStart(2, '0');
        const mm = String(plus.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = plus.getFullYear();
        this.checkout = yyyy + '-' + mm + '-' + dd;
        // alert('Modal Sent Data :'+ dataReturned);
      }
    });
    return await modal.present();
  }

  async popupCalendar2() {
    console.log('today:' + this.today);
    const modal = await this.modalController.create({
      component: PopCalendar2Page,
      mode: 'ios',
      showBackdrop: true,
      componentProps: {
        today: this.today
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log(dataReturned);
        this.checkout = dataReturned.data;

        const dtx = this.today.split('-');
        const dtx2 = this.checkout.split('-');
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate: any = new Date(dtx[0], dtx[1], dtx[2]);
        const secondDate: any = new Date(dtx2[0], dtx2[1], dtx2[2]);

        const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
        console.log(diffDays);

        if (diffDays < 7) {
          this.count = diffDays;
          for (let x = 0; x < this.list_harga.length; x++) {
            console.log(this.list_harga[x].durasi.durasi);
            if (this.list_harga[x].durasi.durasi === 'Hari') {
              this.pickDurasi(this.list_harga[x]);
            }
          }
        } else if (diffDays < 30) {
          this.count = diffDays;
          for (let x = 0; x < this.list_harga.length; x++) {
            console.log(this.list_harga[x].durasi.durasi);
            if (this.list_harga[x].durasi.durasi === 'Hari') {
              this.pickDurasi(this.list_harga[x]);
            }
          }
        } else if (diffDays >= 30) {
          this.count = diffDays;
          for (let x = 0; x < this.list_harga.length; x++) {
            console.log(this.list_harga[x].durasi.durasi);
            if (this.list_harga[x].durasi.durasi === 'Hari') {
              this.pickDurasi(this.list_harga[x]);
            }
          }
        }
        this.count = diffDays;
        // alert('Modal Sent Data :'+ dataReturned);
      }
    });
    return await modal.present();
  }
  async booking() {
    let total_baru = 0;
    let nominal_diskon = 0;
    this.total_harga = this.harga * this.count;
    if (this.diskon !== 0 || this.diskon !== undefined) {
      total_baru = this.total_harga - ((this.diskon / 100) * this.total_harga);
      nominal_diskon = (this.diskon / 100) * this.total_harga;
    }
    const satuan = this.durasiPicked.durasi.durasi;
    const durasi_id = this.durasiPicked.durasi_id;

    const modal = await this.modalController.create({
      component: BookingPopupPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'my-custom-class',
      componentProps: {
        pelanggan_id  : this.user.id,
        homestay_id   : this.data.homestay[0].id,
        homestay      : this.data.homestay[0].nama,
        total         : total_baru.toString(),
        diskon        : (nominal_diskon).toString(),
        durasi        : this.count.toString(),
        tanggal       : this.today,
        end           : this.checkout,
        harga         : this.harga,
        usePoin       : this.usePoin,
        satuan,
        durasi_id
      }
    });
    return await modal.present();
  }
  bookingx() {
    if (this.user) {
      if (!this.agree) {
        alert('please check out our agreement terms & condition');
      } else {
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
            // console.log('Loading dismissed!');
          });
        });
      }
    } else {
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
              const navigationExtras: NavigationExtras = {
                state: {
                  id : this.data.id
                }
              };
              this.router.navigate(['login'], navigationExtras);
              // this.router.navigateByUrl("login", { skipLocationChange: true });

            }
          }
        ]
      }).then((res) => {
        res.present();

        res.onDidDismiss().then((dis) => {
          // console.log('Loading dismissed!');
        });
      });
    }
    // this.router.navigateByUrl('/berhasil');
  }
  doBookingx() {
    let total_baru = 0;
    if (this.diskon !== 0 || this.diskon !== undefined) {
      total_baru = this.total_harga - ((this.diskon / 100) * this.total_harga);
    }
    console.log(total_baru);
  }
  doBooking() {
    let total_baru = 0;
    let nominal_diskon = 0;
    this.total_harga = this.harga * this.count;
    if (this.diskon !== 0 || this.diskon !== undefined) {
      total_baru = this.total_harga - ((this.diskon / 100) * this.total_harga);
      nominal_diskon = (this.diskon / 100) * this.total_harga;
    }
    // loading dulu
    this.loading = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        // console.log('Loading dismissed!');
      });
    });

    const headers = new Headers();
    headers.append('x-api-key', this.serv.header_key);
    const requestOptions = new RequestOptions({ headers });
    const body = new FormData;

    body.append('pelanggan_id', this.user.id);
    body.append('homestay_id', this.data.homestay[0].id);
    body.append('total', (total_baru).toString() );
    body.append('diskon', (nominal_diskon).toString() );
    body.append('durasi', this.count.toString());
    body.append('tanggal', this.today);
    body.append('end', this.checkout);
    body.append('harga', this.harga);
    body.append('usePoin', this.usePoin.toString());

    const satuan = this.durasiPicked.durasi.durasi;
    body.append('satuan', satuan);

    const durasi_id = this.durasiPicked.durasi_id;
    body.append('durasi_id', durasi_id);

    this.http.post(this.serv.base_url + 'booking', body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        const response = data.json();
        // console.log(data);

        if (response.status === 'Success') {

          this.navCtrl.navigateRoot('/home');
          const navigationExtras: NavigationExtras = {
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
        } else {
          if (response.message === 'Stok Homestay Kosong') {
            const alert = this.alertController.create({
              header: response.status,
              message: 'Homestay Not available',
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
                // console.log('Loading dismissed!');
              });
            });
          } else {
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
                // console.log('Loading dismissed!');
              });
            });
          }
        }

      }, error => {
        this.loadingController.dismiss();
        // console.log(error);
    });
  }
  share() {
    this.newVariable = window.navigator;
    if (this.newVariable.share) {
      this.newVariable.share({
        title: 'Homestay81',
        text: 'Homestay81',
        url: 'https://homestay81.com/detail?id=' + this.id,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      // alert("Share not supported");
      this.socialSharing.share('https://homestay81.com/detail?id=' + this.id, this.nama, null, 'https://homestay81.com/detail?id=' + this.id);
    }
  }
  onChange(evt) {
    const val = evt.detail.value;
    const split = val.split('#');
    if (val !== '0') {
      const disc = (this.diskon / 100) * split[2];
      this.total_harga = this.qty * (split[2]);
    } else {
      this.total_harga = this.total_old;
    }
  }

  async kurang() {
    if (this.count > 1) {
    this.count -= 1;
    }
    const val = this.form_durasi;
    if (val !== '0') {
      const split = val.split('#');
      this.total_harga = this.count * parseInt(split[2]) - (this.diskon / 100 * parseInt(split[2])) ;
    } else {
      this.total_harga = this.count * this.total_old;
    }

    const plus = new Date(this.checkout);
    if(this.durasiPicked.durasi.durasi == 'Hari') {
      plus.setDate(plus.getDate() - this.count);
      if(plus > new Date(this.today)) {
        const dd = String(plus.getDate()).padStart(2, '0');
        const mm = String(plus.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = plus.getFullYear();
        this.checkout = yyyy + '-' + mm + '-' + dd;
      } else {
        const toast = await this.toastController.create({
          message: 'Tanggal checkout tidak boleh kurang dari tanggal checkin.',
          duration: 2000
        });
        toast.present();
      }
    } else if(this.durasiPicked.durasi.durasi == 'Minggu') {
      plus.setDate(plus.getDate() - (this.count * 7));
      if(plus > new Date(this.today)) {
        const dd = String(plus.getDate()).padStart(2, '0');
        const mm = String(plus.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = plus.getFullYear();
        this.checkout = yyyy + '-' + mm + '-' + dd;
      } else {
        const toast = await this.toastController.create({
          message: 'Tanggal checkout tidak boleh kurang dari tanggal checkin.',
          duration: 2000
        });
        toast.present();
      }
    } else if(this.durasiPicked.durasi.durasi == 'Bulanan') {
      plus.setMonth(plus.getMonth() - this.count);
      if(plus > new Date(this.today)) {
        const dd = String(plus.getDate()).padStart(2, '0');
        const mm = String(plus.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = plus.getFullYear();
        this.checkout = yyyy + '-' + mm + '-' + dd;
      } else {
        const toast = await this.toastController.create({
          message: 'Tanggal checkout tidak boleh kurang dari tanggal checkin.',
          duration: 2000
        });
        toast.present();
      }
    }
  }
  
  tambah() {
    this.count += 1;
    const val = this.form_durasi;
    if (val !== '0') {
      const split = val.split('#');
      this.total_harga = this.count * parseInt(split[2]) - (this.diskon / 100 * parseInt(split[2]));
    } else {
      this.total_harga = this.count * this.total_old;
    }

    const plus = new Date(this.checkout);
    console.log(this.durasiPicked)
    if(this.durasiPicked.durasi.durasi == 'Hari') {
      plus.setDate(plus.getDate() + 1);
    } else if(this.durasiPicked.durasi.durasi == 'Minggu') {
      plus.setDate(plus.getDate() + 7);
    } else if(this.durasiPicked.durasi.durasi == 'Bulanan') {
      plus.setMonth(plus.getMonth() + 1);
    }
    const dd = String(plus.getDate()).padStart(2, '0');
    const mm = String(plus.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = plus.getFullYear();
    this.checkout = yyyy + '-' + mm + '-' + dd;
  }
  kurang2() {
    if (this.jumlah_kamar > 1) {
    this.jumlah_kamar -= 1;
    }
    const val = this.form_durasi;
    if (val !== '0') {
      const split = val.split('#');
      this.total_harga = this.jumlah_kamar * parseInt(split[2]) - (this.diskon / 100 * parseInt(split[2])) ;
    } else {
      this.total_harga = this.jumlah_kamar * this.total_old;
    }
  }
  tambah2() {
    this.jumlah_kamar += 1;
    const val = this.form_durasi;
    if (val !== '0') {
      const split = val.split('#');
      this.total_harga = this.jumlah_kamar * parseInt(split[2]) - (this.diskon / 100 * parseInt(split[2]));
    } else {
      this.total_harga = this.jumlah_kamar * this.total_old;
    }
  }
  qtyChanged(event) {
    const qty = event.detail.value;
    const val = this.durasiPicked;
    // let split = val.split("#");

    this.total_harga = this.count * qty * parseInt(val.harga) - (this.diskon / 100 * parseInt(val.harga));
    // console.log(parseInt(split[2]));
  }
  backToHome() {
    this.router.navigateByUrl('/home');
    // this.router.navigateByUrl('/detail');
    const navigationExtras: NavigationExtras = {
      state: {
        id : this.data.homestay[0].id
      }
    };
    // this.router.navigate(['detail'], navigationExtras);
    this.router.navigate(['/detail'], { queryParams: { id : this.data.homestay[0].id } });
  }
  myBackButton() {
    this.location.back();
  }
  toRp(val) {
    return this.serv.toRp(val);
  }
  poinToRp(val) {
    return this.serv.toRp(val * 1000);
  }

}
