import { Location } from '@angular/common';
import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import { ToastController, LoadingController, Platform, AlertController } from "@ionic/angular";

import { Plugins } from '@capacitor/core';
import { map } from "rxjs/operators";
import { FileUploader, FileItem } from 'ng2-file-upload';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File as Fl } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
// import {NgxImageCompressService} from 'ngx-image-compress';
// import * as watermark from 'watermarkjs';
import { DatePipe } from '@angular/common';

declare var cordova: any;

@Component({
  selector: 'app-detail-booking',
  templateUrl: './detail-booking.page.html',
  styleUrls: ['./detail-booking.page.scss'],
})
export class DetailBookingPage implements OnInit {

  public imagePath;
  imgURL: any;
  public message: string;

  preview(files) {
    console.log(files)
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

  clickedImage: string;
  
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  loading;
  terdekat_subtitle;gps_subtitle;filter_subtitle;daftar_subtitle;
  bahasa;bahasa_name;

  lat: number;
  picture: any;
  base64Image: any;
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
  expired;

  list_bank;
  timer;

  base;

  subtitle_lakukan_pembayaran;btn_detail_pesanan;subtitle_back;subtitle_detail_pembayaran;subtitle_biaya;subtitle_durasi;subtitle_konfirmasi;

  konfirmasi;
  diskon;
  
  uploader;
  isUploaded = false;
  bukti;
  lastImage;placeholder_file_diupload_1;
  subtitle_choose = "Browse File";

  status;subtitle_form;

  isKonfirm;
  base_url_image;

  use_poin = "0";

  constructor(
    private http: Http,
    private router: Router,
    public platform: Platform,
    private route: ActivatedRoute,  
    private serv: MyserviceService,
    private storage: StorageMap,
    public toastController: ToastController,
    private location: Location,
    private camera: Camera, 
    private transfer: FileTransfer,
    private file: Fl,
    private filePath: FilePath,
    private alertController: AlertController,
    private loadingController : LoadingController,
    // private imageCompress: NgxImageCompressService,
    public datePipe: DatePipe,
  ) {
    this.base           = this.serv.base_url_img;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.id = this.router.getCurrentNavigation().extras.state.id;
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

    this.setupUploader();
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
      duration: 5000,
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

    this.http.post(this.serv.base_url+"detail_booking", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();

        if(response.status=="Success"){
          this.list         = response.list;
          this.expired      = response.list[0].expired;
          this.list_bank    = response.list[0].bank;
          this.konfirmasi   = response.list[0].konfirmasi;
          this.diskon       = response.list[0].diskon;

          this.status       = response.list[0].status_bayar;

          this.use_poin     = response.list[0].use_poin;

          // let ar            = expired.split(" ");
          // let ar2           = ar[1].split(".");
          // this.expired      = ar2[0];

          this.setupCountdown();
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
        this.subtitle_lakukan_pembayaran  = response.id.subtitle_lakukan_pembayaran;
        this.btn_detail_pesanan           = response.id.btn_detail_pesanan;
        this.subtitle_back                = response.id.subtitle_back;
        this.subtitle_detail_pembayaran   = response.id.subtitle_detail_pembayaran;
        this.subtitle_durasi        = response.id.subtitle_durasi;
        this.subtitle_biaya         = response.id.subtitle_biaya;
        this.subtitle_konfirmasi    = response.id.subtitle_konfirmasi;
      }else if(this.bahasa=="en"){
        this.terdekat_subtitle       = response.en.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.en.GPS_SUBTITLE;
        this.filter_subtitle         = response.en.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.en.DAFTAR_SUBTITLE;
        this.subtitle_lakukan_pembayaran  = response.en.subtitle_lakukan_pembayaran;
        this.btn_detail_pesanan           = response.en.btn_detail_pesanan;
        this.subtitle_back                = response.en.subtitle_back;
        this.subtitle_detail_pembayaran   = response.en.subtitle_detail_pembayaran;
        this.subtitle_durasi        = response.en.subtitle_durasi;
        this.subtitle_biaya         = response.en.subtitle_biaya;
        this.subtitle_konfirmasi    = response.en.subtitle_konfirmasi;
      }else if(this.bahasa=="ch"){
        this.terdekat_subtitle       = response.ch.TERDEKAT_SUBTITLE;
        this.gps_subtitle            = response.ch.GPS_SUBTITLE;
        this.filter_subtitle         = response.ch.FILTER_SUBTITLE;
        this.daftar_subtitle         = response.ch.DAFTAR_SUBTITLE;
        this.subtitle_lakukan_pembayaran  = response.ch.subtitle_lakukan_pembayaran;
        this.btn_detail_pesanan           = response.ch.btn_detail_pesanan;
        this.subtitle_back                = response.ch.subtitle_back;
        this.subtitle_detail_pembayaran   = response.ch.subtitle_detail_pembayaran;
        this.subtitle_durasi        = response.ch.subtitle_durasi;
        this.subtitle_biaya         = response.ch.subtitle_biaya;
        this.subtitle_konfirmasi    = response.ch.subtitle_konfirmasi;
      }
      //console.log(response);
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
    body.append("homestay_id",this.list[0].homestay_id);
    body.append("pelanggan_id",this.list[0].pelanggan_id);
    body.append("booking_id",this.id);
    body.append("atas_nama","-");
    body.append("no_rekening","-");
    body.append("nama_bank","-");
    body.append("bank_tujuan","-");
    body.append("nominal",this.list[0].total);
    body.append("bukti",this.bukti);

    this.http.post(this.serv.base_url+"konfirmasi_bayar", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();

        if(response.status=="Success"){
          const alert = this.alertController.create({
            header: response.status,
            message: "Success",
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
  setupCountdown(){
    var compareDate = new Date();
    compareDate.setDate(this.expired);
    let self = this;
    this.timer = setInterval(function() {
      self.timeBetweenDates(compareDate);
    }, 1000);
  }
  timeBetweenDates(toDate) {
    let stringDate : string = this.expired;
    toDate = new Date(stringDate.replace(/-/g,"/"));

    var dateEntered = toDate;
    var now = new Date();
    var difference = dateEntered.getTime() - now.getTime();

    // //console.log(this.expired);
    // //console.log(toDate);
    // //console.log(now);
    // //console.log("diff "+difference);

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
  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    alert("copied");
  }

  AccessCamera(){

    this.camera.getPicture({
   
    targetWidth:512,
   
    targetHeight:512,
   
    correctOrientation:true,
   
    sourceType: this.camera.PictureSourceType.CAMERA,
   
    destinationType: this.camera.DestinationType.DATA_URL
   
      }).then((imageData) => {
   
        this.base64Image = 'data:image/jpeg;base64,'+imageData;
   
        this.picture = imageData;
   
            }, (err) => {
   
        console.log(err);
   
      });
   
   }

   

  camera1(){
    this.takePicture(this.camera.PictureSourceType.CAMERA,"1");
  }
  camera2(){
    this.takePicture(this.camera.PictureSourceType.CAMERA,"2");
  }

  oldPath:any;
  public takePicture(sourceType,enumx) {
    // Create options for the Camera Dialog
    var options: CameraOptions = {
      quality: 70,
      sourceType: sourceType,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    // Get the data of an image
    this.camera.getPicture(options).then(async (imagePath) => {
      // Special handling for Android library
      this.oldPath = imagePath;
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        console.log('Android')
        console.log(imagePath)
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            // this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), enumx);
          });
      } else {
        if(imagePath.includes('file://')) {
          this.filePath.resolveNativePath(imagePath)
            .then(filePath => {
              console.log('filePath',filePath)
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = /[^/]*$/.exec(imagePath)[0];
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), enumx);
            });
        } else {
          let blob = await this.b64toBlob(imagePath, 'image/jpeg');
          console.log('web/base64 type')
          
          const myFile = new File([blob], this.createFileName(), {
            type: blob.type,
          });

          var reader = new FileReader();
          reader.readAsDataURL(blob); 
          reader.onload = (_event) => { 
            this.imgURL = reader.result; 
            console.log(this.imgURL);
            this.postImage(enumx, this.imgURL, this.createFileName());
          }
          
          console.log(myFile);

          // this.imageCompress.compressFile(imagePath, 0, 50, 50).then(result => {
          //   console.log(result);
          // }, error => {
          //   console.log(JSON.stringify('err kompres ' + error));
          // })
          
          // let date = this.datePipe.transform(new Date(), 'dd MMM yyyy HH:mm');
          // await watermark([blob]).image(watermark.text.lowerLeft(date + " - Homestay", '16px Arial', '#fff', 1)).then(img => {
          //   this.imageCompress.compressFile(img.src, 0, 50, 50).then(result => {
          //     console.log(result)
          //     this.postImage(enumx, result, this.createFileName());
          //   }, error => {
          //     console.log(JSON.stringify('err kompres ' + error));
          //   })
          // }, error => {
          //   console.log(JSON.stringify('error '+ error));
          // });
      
          // this.filePath.resolveNativePath(imagePath)
          //   .then(filePath => {
          //     console.log('filePath',filePath)
          //     let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          //     let currentName = filePath.substring(filePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('/'));
          //     this.copyFileToLocalDir(imagePath, currentName, this.createFileName(), enumx);
          //   });
        }
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // saveBase64(blob:any, name:string):Promise<string>{
  //   return new Promise((resolve, reject)=>{
  //     this.file.writeFile(cordova.file.dataDirectory, name, blob)
  //     .then(()=>{
  //       resolve(cordova.file.dataDirectory+name);
  //     })
  //     .catch((err)=>{
  //       console.log('error writing blob')
  //       reject(err)
  //     })
  //   })
  // }
  
  //convert base64 to blob
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
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
    console.log('masuk copy',namePath)
    console.log('masuk copy',currentName)
    console.log('masuk copy',newFileName)
    this.file.copyFile(namePath, currentName, this.file.externalDataDirectory, newFileName).then(async success => {
      this.lastImage = newFileName;
      // this.imgURL = success.toURL(); 
      // console.log('success ',this.imgURL);
      console.log('success ',success);
      console.log('url', success.toURL())
      
      // let file = this.file.writeFile(success.nativeURL, success.name, success).then(res => {
        
      // })
      // var image = new File([success], newFileName, { type: 'image/png' });
      // console.log(file);
      // this.uploadImage(enumx, success);
      // this.postImage(enumx, success, newFileName);
    }, error => {
      console.log('error ',error)
      this.presentToast('Error while storing file.');
    });
  } 

  uploadImgResult:any;
  postImage(enumx, success, newFileName) {
    var url = this.serv.base_url+"upload_bukti";
    console.log(url);
    
    // var image = new File([success], newFileName, { type: 'image/png' });
    // console.log(image);
    let body = new FormData();
    body.append("file", success);
    body.append("name", newFileName);
    body.append("section", "whatever");
 
    this.http.post(url, body).subscribe(res => {
      console.log(res)
      this.uploadImgResult = res;
      let bukti = JSON.parse(this.uploadImgResult._body);
      console.log(bukti)
      this.bukti = bukti.message;
      this.isUploaded = true;
    }, err => {
      console.log(err)
    })
  }

  // public pathForImage(img) {
  //   if (img === null) {
  //     return '';
  //   } else {
  //     return this.file.externalDataDirectory + img;
  //   }
  // }

  /* captureImage() {
    this.camera.getPicture(this.options).then((imageData) => {
      
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.clickedImage = base64Image;
    }, (err) => {
      console.log(err);
      // Handle error
    });
  } */
  
  public uploadImage(enumx, success) {
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
    // var targetPath = this.pathForImage(this.lastImage);
    // console.log(targetPath);
 
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
    // fileTransfer.upload(targetPath, url, options).then(data => {
    //   this.loadingController.dismiss();
    //   let json = JSON.parse(data.response);
    //   this.lastImage = json.nama_file;
    //   this.presentToast('Image succesful uploaded.');
    //   console.log(json);
    //   if(enumx=="1"){
    //     this.placeholder_file_diupload_1 = json.message;
    //     this.bukti = json.message;
    //     this.isUploaded = true;
    //   }
    // }, err => {
    //   this.loadingController.dismiss();
    //   this.presentToast('Error while uploading file.');
    //   console.log(err);
    //   console.log(err.body);
    // });
  }
  
  setupUploader() {
      //coba pakai post mungkin mas kaya yg file ini?
      // di api nya atau ?
      //di sini 
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
  backToHome(){
    this.router.navigateByUrl('/tabs/tab3');
  }
  myBackButton(){
    this.location.back();
  }
  toRp(val){
    return this.serv.toRp(val)
  }
  presentToast(val){

  }

}