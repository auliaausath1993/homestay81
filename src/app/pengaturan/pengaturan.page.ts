import { Location } from '@angular/common';
import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import { ToastController, LoadingController, Platform, AlertController } from "@ionic/angular";

import { Plugins } from '@capacitor/core';
import { map } from "rxjs/operators";


import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { FileUploader, FileItem } from 'ng2-file-upload';
const URL = "https://homestay.dev5.novatama.com/api/upload_bukti";

declare var cordova: any;
@Component({
  selector: 'app-pengaturan',
  templateUrl: './pengaturan.page.html',
  styleUrls: ['./pengaturan.page.scss'],
})
export class PengaturanPage implements OnInit {
  loading;
  terdekat_subtitle;gps_subtitle;filter_subtitle;daftar_subtitle;
  bahasa_subtitle;
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

  list_bank;

  nama;email;no_hp;foto_ktp;ktp;tempat;tanggal;alamat;foto;

  password  = " ";
  password2 = " ";

  SUBTITLE_BACK;
  subtitle_nama;subtitle_hp;subtitle_alamat;subtitle_email;subtitle_tempat;subtitle_tgl;subtitle_ktp;subtitle_bahasa;
  button_simpan;

  bukti1 = "-";
  bukti2 = "-";
  uploading;
  uploader1;
  uploader2;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  base;
  menu4;

  subtitle_choose;
  message_update;
  lastImage;
  isUploaded = false;
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
    this.base         = this.serv.base_url_image;
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
    this.setupUploader();
    this.setupUploader2();
  }
  ngOnInit() {
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
        this.bukti1 = json.message;
        this.foto = json.message;
        this.isUploaded = true;
      }else if(enumx=="2"){
        this.isUploaded = true;
        this.bukti2 = json.message;
        this.foto_ktp = json.message;
        this.placeholder_file_diupload_2 = json.message;
      }
    }, err => {
      this.loadingController.dismiss();
      this.presentToast('Error while uploading file.');
      console.log(err);
    });
  }
  setupUploader() {
    console.log("setup uploader 1");
      this.uploader1 = new FileUploader({  
        url: this.serv.base_url + "upload_foto",
        method: 'POST',
        autoUpload:true,
      });
      this.uploader1.onBeforeUploadItem = (item: FileItem) => {
          //console.log("----onBeforeUploadItem");

        //add additional parameters for the serverside
          this.uploader1.options.additionalParameter = {
              name: item.file.name,
              user_id: this.user.id,
              section: "whatever",
              //userid = __this.auth.user.userid;
          };
      };
      
      this.uploader1.onAfterAddingFile = (fileItem) => {
          //console.log("JUST ADDED A FILE: " + fileItem._file.name);
          fileItem.withCredentials = false;
      }

      this.uploader1.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        //console.log("A ITEM UPLOADED SUCCESSFULLY");
        var response_json = JSON.parse(response);
        if(response_json.status=="Success"){
          this.bukti1 = response_json.message;
          this.getData();
        }else{
          alert(response_json.message);
        }
        //console.log("--uploader.getNotUploadedItems().length: " + this.uploader.getNotUploadedItems().length);
    };
  }
  setupUploader2() {
    console.log("setup uploader 2");
      this.uploader2 = new FileUploader({  
        url: this.serv.base_url + "upload_foto_2",
        method: 'POST',
        autoUpload:true,
      });
      this.uploader2.onBeforeUploadItem = (item: FileItem) => {
          //console.log("----onBeforeUploadItem");

        //add additional parameters for the serverside
          this.uploader2.options.additionalParameter = {
              name: item.file.name,
              user_id: this.user.id,
              section: "whatever",
              //userid = __this.auth.user.userid;
          };
      };
      
      this.uploader2.onAfterAddingFile = (fileItem) => {
          //console.log("JUST ADDED A FILE: " + fileItem._file.name);
          fileItem.withCredentials = false;
      }

      this.uploader2.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        //console.log("A ITEM UPLOADED SUCCESSFULLY");
        var response_json = JSON.parse(response);
        if(response_json.status=="Success"){
          this.bukti2 = response_json.message;
          this.getData();
        }else{
          alert(response_json.message);
        }
        //console.log("--uploader.getNotUploadedItems().length: " + this.uploader.getNotUploadedItems().length);
    };
  }
  async ionViewWillEnter(){
    this.storage.get('user').subscribe((data) => {
      if(data){
        this.user = data;
        this.getData();
      }
    });
  }
  async getData(){
    const position = await Plugins.Geolocation.getCurrentPosition();
    //console.log(position);
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

    this.http.post(this.serv.base_url+"get_profile", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();

        if(response.status=="Success"){
          for(let x = 0;x<response.data.length;x++){
            let item      = response.data[x];

            this.nama     = item.nama;
            this.email    = item.email;
            this.no_hp    = item.no_hp;
            this.ktp      = item.no_ktp;
            this.tempat   = item.tempat_lahir;
            this.tanggal  = item.tanggal_lahir;
            this.alamat   = item.alamat;

            this.foto     = item.foto;
            this.foto_ktp = item.foto_ktp;
          }
        }
        //console.log(data);
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  async postData(){
    this.storage.set('bahasa',this.bahasa).subscribe(() => {
      let lang = "Indonesia";
      if(this.bahasa=="en"){
        lang = "English";
      }
      this.storage.set('bahasa_name',lang).subscribe(() => {
        this.bahasa_name = lang;
        this.getSubtitle();
      });
    });

    //console.log(position);
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
    body.append("nama",this.nama);
    body.append("email",this.email);
    body.append("no_hp",this.no_hp);
    body.append("foto_ktp",this.foto_ktp);
    body.append("foto",this.foto);
    body.append("ktp",this.ktp);
    body.append("tempat",this.tempat);
    body.append("tanggal",this.tanggal);
    body.append("alamat",this.alamat);
    body.append("password",this.password);
    body.append("password2",this.password2);

    this.http.post(this.serv.base_url+"update_profile", body, requestOptions)
    .subscribe(async data => {
        this.loadingController.dismiss();
        var response = data.json();
        
        if(response.status=="Success"){
          // const alert = this.alertController.create({
          // header: "",
          // message: this.message_update,
          // buttons: ['Ok']}).then(alert=> alert.present());
          const toast = await this.toastController.create({
            message: this.message_update,
            duration: 2000
          });
          toast.present();
          
          for(let x = 0;x<response.data.length;x++){
            let item      = response.data[x];

            this.nama     = item.nama;
            this.email    = item.email;
            this.no_hp    = item.no_hp;
            this.foto_ktp = item.foto;
            this.ktp      = item.no_ktp;
            this.tempat   = item.tempat_lahir;
            this.tanggal  = item.tanggal_lahir;
            this.alamat   = item.alamat;
          }

          this.getData();
          //location.reload();
          //location.href = "https://homestay81.com";
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
        this.SUBTITLE_BACK          = response.id.BACK_BUTTON;

        this.subtitle_nama = response.id.REGISTER_NAMA;
        this.subtitle_hp = response.id.REGISTER_HP;
        this.subtitle_alamat = response.id.REGISTER_ALAMAT;
        this.subtitle_tempat = response.id.REGISTER_TEMPAT;
        this.subtitle_tgl = response.id.REGISTER_TGL;
        this.subtitle_ktp = response.id.REGISTER_KTP;

        this.button_simpan  = response.id.button_simpan;

        this.menu4 = response.id.menu4;

        this.subtitle_choose = response.id.subtitle_choose;
        this.message_update = response.id.message_update;

        this.subtitle_bahasa = response.id.bahasa_subtitle;
      }else if(this.bahasa=="en"){
        this.terdekat_subtitle       = response.en.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.en.GPS_SUBTITLE;
        this.filter_subtitle         = response.en.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.en.DAFTAR_SUBTITLE;
        this.SUBTITLE_BACK           = response.en.BACK_BUTTON;

        this.subtitle_nama = response.en.REGISTER_NAMA;
        this.subtitle_hp = response.en.REGISTER_HP;
        this.subtitle_alamat = response.en.REGISTER_ALAMAT;
        this.subtitle_tempat = response.en.REGISTER_TEMPAT;
        this.subtitle_tgl = response.en.REGISTER_TGL;
        this.subtitle_ktp = response.en.REGISTER_KTP;

        this.button_simpan  = response.en.button_simpan;

        this.menu4 = response.en.menu4;

        this.subtitle_choose = response.en.subtitle_choose;
        this.message_update = response.en.message_update;

        this.subtitle_bahasa = response.en.bahasa_subtitle;
      }else if(this.bahasa=="ch"){
        this.terdekat_subtitle       = response.ch.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.ch.GPS_SUBTITLE;
        this.filter_subtitle         = response.ch.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.ch.DAFTAR_SUBTITLE;

        this.button_simpan  = response.ch.button_simpan;
        
        this.menu4 = response.ch.menu4;
        
        this.subtitle_choose = response.ch.subtitle_choose;
        this.message_update = response.ch.message_update;

        this.subtitle_bahasa = response.ch.bahasa_subtitle;
      }
      //console.log(response);
    });
  }
  goToTerms(){
    this.router.navigateByUrl('/terms');
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
    this.router.navigate(['home']);
  }
  toRp(val){
    return this.serv.toRp(val)
  }
  private presentToast(text) {
    
  }

}
