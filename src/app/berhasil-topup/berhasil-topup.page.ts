import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import { ToastController, LoadingController, Platform } from "@ionic/angular";
import { MenuController, Events } from '@ionic/angular';
import { Location } from '@angular/common';

import { Plugins } from '@capacitor/core';
import { map } from "rxjs/operators";

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
// import { Clipboard } from '@ionic-native/clipboard/ngx';



import { FileUploader, FileItem } from 'ng2-file-upload';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

declare var cordova: any;
@Component({
  selector: 'app-berhasil-topup',
  templateUrl: './berhasil-topup.page.html',
  styleUrls: ['./berhasil-topup.page.scss'],
})
export class BerhasilTopupPage implements OnInit {
  CopyInputText:string = "Hello World!";
  picked = [];
  list = [];
  base_url_image;topupdata;
  price;price_disc;
  no_rekening;
  bukti;
  uploading;
  uploader;loading;
  val;pelanggan_id;
  bukti_transfer;

  isUploaded;placeholder_file_diupload_1;lastImage;

  constructor(
    private clipboard: Clipboard,
    private http: Http,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,  
    private serv: MyserviceService,
    private storage: StorageMap,
    private transfer: FileTransfer,
    private file: File,
    private filePath: FilePath,
    private camera: Camera,
    public platform: Platform,
    private loadingController : LoadingController,) {
      this.base_url_image = this.serv.base_url_image;
      this.route.queryParams.subscribe(params => {
        console.log(params);
        if (this.router.getCurrentNavigation().extras.state) {
          this.picked = this.router.getCurrentNavigation().extras.state.picked;
          this.topupdata = this.router.getCurrentNavigation().extras.state.topup;

          this.price = this.topupdata.price;
          this.price_disc = this.topupdata.price_disc;
          console.log(this.picked);
          console.log(this.topupdata);
          console.log(this.price);
          console.log(this.price_disc);
        }
      });



      this.storage.get('user').subscribe((data) => {
        if(data){
          //console.log(data);
          this.val = data;
          this.pelanggan_id = this.val.id;
          this.getData();
        }
      });
      
      //upload file
      this.setupUploader();
  }

  ngOnInit() {
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
        console.log("A ITEM UPLOADED SUCCESSFULLY");
        var response_json = JSON.parse(response);
        console.log(response_json);
        if(response_json.status=="Success"){
          this.bukti_transfer = response_json.message;
          this.loadingController.dismiss();
        }else{
          alert(response_json.message);
        }
        //console.log("--uploader.getNotUploadedItems().length: " + this.uploader.getNotUploadedItems().length);
    };
  }
  backToHome(){
    this.router.navigateByUrl('/home');
  }
  myBackButton(){
    this.location.back();
  }

  
  async getData(){
    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;

    // body.append("pelanggan_id",this.pelanggan_id);
    // body.append("latitude",this.lat.toString());
    // body.append("longitude",this.lng.toString());
    
    this.http.post(this.serv.base_url+"get_bank", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();
        this.list = response.data;
        this.no_rekening = this.list['no_rekening'];
        //console.log(data);
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
      });
    }
    
  // Copy
 /*  copyString(){
    this.clipboard.copy(this.CopyInputText);
  } */
  
  pick(data){
    if(this.picked.indexOf(data) > -1){
      let idx = this.picked.indexOf(data);
      console.log(idx);
      this.picked.splice(idx,1);
    }else{
      this.picked.push(data);
    }
    console.log(this.picked);
  }
  cek(data){
    if(this.picked.indexOf(data) > -1){
      return true;
    }else{
      return false;
    }
  }
  topup(){

    //loading dulu
    this.loading = this.loadingController.create({
      message: 'Please Wait'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed!');
      });
    });
    
    var headers = new Headers();
    headers.append("x-api-key", this.serv.header_key);
    let requestOptions = new RequestOptions({ headers: headers });
    let body = new FormData;

    body.append("pelanggan_id",this.pelanggan_id);
    body.append("bukti",this.bukti_transfer);
    body.append("topup_id",this.topupdata.id);
    // body.append("longitude",this.lng.toString());

    this.http.post(this.serv.base_url+"konfirmasi_topup", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        var response = data.json();
        if(response.status=="Success"){
          alert("Thanks, you'll be notified when the confirmation is done");
          this.router.navigateByUrl('/home');
        }else{
          alert(response.message);
        }
        //console.log(data);
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
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
      }
    }, err => {
      this.loadingController.dismiss();
      this.presentToast('Error while uploading file.');
      console.log(err);
    });
  }
  presentToast(val){

  }
  toRp(val){
    return this.serv.toRp(val);
  }

}
