import { Location } from '@angular/common';
import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import { ToastController, LoadingController, AlertController, Platform } from "@ionic/angular";

import { FileUploader, FileItem } from 'ng2-file-upload';

import { Plugins } from '@capacitor/core';
import { map } from "rxjs/operators";



import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

// const URL = '/api/';
const URL = "https://homestay.dev5.novatama.com/api/upload_bukti";

declare var cordova: any;
@Component({
  selector: 'app-konfirmasi',
  templateUrl: './konfirmasi.page.html',
  styleUrls: ['./konfirmasi.page.scss'],
})
export class KonfirmasiPage implements OnInit {
  loading;
  terdekat_subtitle;gps_subtitle;filter_subtitle;daftar_subtitle;
  bahasa;bahasa_name;

  lat: number;
  lng: number;
  address: string;
  collection = [1,1,1,1,1,1,1,1];

  daerah;
  latest_homestay;

  id;
  page = 1;
  jenis = "putra";
  type  = "";
  daerah_id;

  user;
  list = [];
  countdown;

  data;
  total;
  homestay;
  kode_booking;
  list_bank;

  atas_nama;
  dari_bank;
  bank_tujuan;
  no_rekening;

  bukti;
  uploading;
  uploader;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  base;
  title_konfirmasi;
  subtitle_detail_pembayaran;
  subtitle_no_rekening;
  subtitle_pemilik;
  subtitle_bank_tujuan;
  subtitle_nominal;
  button_konfirmasi;
  subtitle_form;
  bank_pengirim;

  message_konfirmasi;

  subtitle_back;
  subtitle_choose;
  placeholder_select_bank;
  isUploaded = false;

  placeholder_file_diupload;
  lastImage;
  placeholder_file_diupload_1;placeholder_file_diupload_2
  
  constructor(
    private http: Http,
    public platform: Platform,
    private router: Router,
    private route: ActivatedRoute,  
    private serv: MyserviceService,
    private storage: StorageMap,
    public toastController: ToastController,
    private location: Location,
    private alertController: AlertController,
    private camera: Camera,
    private transfer: FileTransfer,
    private file: File,
    private filePath: FilePath,
    private loadingController : LoadingController
  ) {
    this.base = this.serv.base_url_img;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.list         = this.router.getCurrentNavigation().extras.state.data;
        this.data         = this.router.getCurrentNavigation().extras.state.data;
        this.total        = this.router.getCurrentNavigation().extras.state.data.total;
        this.homestay     = this.router.getCurrentNavigation().extras.state.data.homestay;
        this.list_bank    = this.router.getCurrentNavigation().extras.state.data.bank;
        this.kode_booking = this.router.getCurrentNavigation().extras.state.data.kode_booking;
        //console.log(this.list);
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


    //upload file
    this.setupUploader();
  }

  camera1(){
    this.takePicture(this.camera.PictureSourceType.CAMERA,"1");
  }
  camera2(){
    this.takePicture(this.camera.PictureSourceType.CAMERA,"2");
  }

  public takePicture(sourceType,enumx) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), enumx);
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), enumx);
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }
  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName, enumx) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage(enumx);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
  public uploadImage(enumx) {
    // Destination URLhttp://swm.jobspro.id/api/attendance/upload_attendance
    // Destination URL

    this.loading = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        //console.log('Loading dismissed!');
      });
    });

    var url = this.serv.base_url+"upload_bukti";
    console.log(url);

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {
        'fileName': filename,
      }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    

    // Use the FileTransfer to upload the image
    //"{"status":true,"id_attendance":24,"nama_file":"201905191649221558259359099.jpg","message":"Upload and move success and Your data has been successfully stored into the database"}"
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loadingController.dismiss();
      let json = JSON.parse(data.response);
      this.lastImage = json.nama_file;
      this.presentToast('Image succesful uploaded.');
      console.log(json);
      if(enumx=="1"){
        this.placeholder_file_diupload_1 = json.message;
        this.bukti = json.message;
        this.isUploaded = true;
      }else if(enumx=="2"){
        this.isUploaded = true;
        this.bukti = json.message;
        this.placeholder_file_diupload_2 = json.message;
      }
    }, err => {
      this.loadingController.dismiss();
      this.presentToast('Error while uploading file.');
      console.log(err);
    });
  }
  setupUploader() {
      this.uploader = new FileUploader({  
        url: this.serv.base_url + "upload_bukti",
        method: 'POST',
        autoUpload:true,
      });
      this.uploader.onBeforeUploadItem = (item: FileItem) => {
          //console.log("----onBeforeUploadItem");
        this.loading = this.loadingController.create({
          message: 'Please Wait'
        }).then((res) => {
          res.present();
    
          res.onDidDismiss().then((dis) => {
            //console.log('Loading dismissed!');
          });
        });
        
        //add additional parameters for the serverside
          this.uploader.options.additionalParameter = {
              name: item.file.name,
              section: "whatever",
              //userid = __this.auth.user.userid;
          };
      };
      
      this.uploader.onAfterAddingFile = (fileItem) => {
          //console.log("JUST ADDED A FILE: " + fileItem._file.name);
          fileItem.withCredentials = false;
      }

      this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        //console.log("A ITEM UPLOADED SUCCESSFULLY");
        var response_json = JSON.parse(response);
        if(response_json.status=="Success"){
          this.bukti = response_json.message;
          this.isUploaded = true;
          this.loadingController.dismiss();
        }else{
          alert(response_json.message);
        }
        //console.log("--uploader.getNotUploadedItems().length: " + this.uploader.getNotUploadedItems().length);
    };
  }
  ngOnInit() {
  }
  async ionViewWillEnter(){
    this.storage.get('user').subscribe((data) => {
      if(data){
        this.user = data;
        //this.getData();
      }
    });
  }
  async doKonfirmasi(){
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

    body.append("id",this.id);
    body.append("homestay_id",this.homestay.id);
    body.append("pelanggan_id",this.data.pelanggan_id);
    body.append("booking_id",this.data.id);
    body.append("atas_nama",this.atas_nama);
    body.append("no_rekening",this.no_rekening);
    body.append("nama_bank",this.dari_bank);
    body.append("bank_tujuan",this.bank_tujuan);
    body.append("nominal",this.total);
    body.append("bukti",this.bukti);

    this.http.post(this.serv.base_url+"konfirmasi_bayar", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();

        if(response.status=="Success"){
          const alert = this.alertController.create({
            header: response.status,
            message: this.message_konfirmasi,
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.location.back();
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
            const alert = this.alertController.create({header: response.status,message: response.message+" "+this.subtitle_form,}).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
          }else{
            const alert = this.alertController.create({header: response.status,message: response.message,}).then((res) => {res.present();res.onDidDismiss().then((dis) => {});});
          }
        }
        //console.log(data);
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  getSubtitle(){
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      var response = data.json();
      if(this.bahasa=="id"){
        this.terdekat_subtitle      = response.id.TERDEKAT_SUBTITLE;
        this.gps_subtitle           = response.id.GPS_SUBTITLE;
        this.filter_subtitle        = response.id.FILTER_SUBTITLE;
        this.daftar_subtitle        = response.id.DAFTAR_SUBTITLE;
        this.title_konfirmasi       = response.id.title_konfirmasi;
        this.subtitle_detail_pembayaran = response.id.subtitle_detail_pembayaran;
        this.subtitle_no_rekening   = response.id.subtitle_no_rekening;
        this.subtitle_pemilik       = response.id.subtitle_pemilik;
        this.subtitle_bank_tujuan   = response.id.subtitle_bank_tujuan;
        this.subtitle_nominal       = response.id.subtitle_nominal;
        this.button_konfirmasi      = response.id.button_konfirmasi;
        this.subtitle_back          = response.id.subtitle_back;
        this.message_konfirmasi     = response.id.message_konfirmasi;
        this.subtitle_choose        = response.id.subtitle_choose;
        this.placeholder_select_bank= response.id.placeholder_select_bank;
        this.placeholder_file_diupload= response.id.placeholder_file_diupload;
        this.subtitle_form          = response.id.subtitle_form;
        this.bank_pengirim          = response.id.bank_pengirim;
        this.bank_tujuan          = response.id.bank_tujuan;
      }else if(this.bahasa=="en"){
        this.terdekat_subtitle       = response.en.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.en.GPS_SUBTITLE;
        this.filter_subtitle         = response.en.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.en.DAFTAR_SUBTITLE;
        this.title_konfirmasi        = response.en.title_konfirmasi;
        this.subtitle_detail_pembayaran = response.en.subtitle_detail_pembayaran;
        this.subtitle_no_rekening   = response.en.subtitle_no_rekening;
        this.subtitle_pemilik       = response.en.subtitle_pemilik;
        this.subtitle_bank_tujuan   = response.en.subtitle_bank_tujuan;
        this.subtitle_nominal       = response.en.subtitle_nominal;
        this.button_konfirmasi      = response.en.button_konfirmasi;
        this.subtitle_back          = response.en.subtitle_back;
        this.message_konfirmasi     = response.en.message_konfirmasi;
        this.subtitle_choose        = response.en.subtitle_choose;
        this.placeholder_select_bank= response.en.placeholder_select_bank;
        this.placeholder_file_diupload= response.en.placeholder_file_diupload;
        this.subtitle_form          = response.en.subtitle_form;
        this.bank_pengirim          = response.en.bank_pengirim;
        this.bank_tujuan          = response.en.bank_tujuan;
      }else if(this.bahasa=="ch"){
        this.terdekat_subtitle       = response.ch.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.ch.GPS_SUBTITLE;
        this.filter_subtitle         = response.ch.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.ch.DAFTAR_SUBTITLE;
        this.title_konfirmasi        = response.ch.title_konfirmasi;
        this.subtitle_detail_pembayaran = response.ch.subtitle_detail_pembayaran;
        this.subtitle_no_rekening   = response.ch.subtitle_no_rekening;
        this.subtitle_pemilik       = response.ch.subtitle_pemilik;
        this.subtitle_bank_tujuan   = response.ch.subtitle_bank_tujuan;
        this.subtitle_nominal       = response.ch.subtitle_nominal;
        this.button_konfirmasi      = response.ch.button_konfirmasi;
        this.subtitle_back          = response.ch.subtitle_back;
        this.message_konfirmasi     = response.ch.message_konfirmasi;
        this.subtitle_choose        = response.ch.subtitle_choose;
        this.placeholder_select_bank= response.ch.placeholder_select_bank;
        this.placeholder_file_diupload= response.ch.placeholder_file_diupload;
        this.subtitle_form          = response.ch.subtitle_form;
        this.bank_pengirim          = response.ch.bank_pengirim;
        this.bank_tujuan          = response.ch.bank_tujuan;
      }
      //console.log(response);
    });
  }
  goToKonfirmasi(data){
    let navigationExtras: NavigationExtras = {
      state: {
        data: data
      }
    };
    this.router.navigate(['konfirmasi'], navigationExtras);
  }
  goToDetail(data){
    let navigationExtras: NavigationExtras = {
      state: {
        id : data.id
      }
    };
    this.router.navigate(['detail-booking'], navigationExtras);
  }
  myBackButton(){
    this.location.back();
  }
  toRp(val){
    return this.serv.toRp(val)
  }
  private presentToast(text) {
    
  }

}
