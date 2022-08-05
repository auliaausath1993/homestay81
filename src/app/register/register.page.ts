
import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LoadingController, AlertController, Platform, ToastController } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

declare var cordova: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  bahasa;bahasa_name;
  subtitle_nama;subtitle_hp;subtitle_alamat;subtitle_email;subtitle_tempat;subtitle_tgl;subtitle_ktp;
  nama;hp;alamat;email;tempat;tgl;ktp;subtitle_required;SUBTITLE_BACK;

  button_register;

  collection = [1,1,1,1,1,1,1,1];
  
  uploader1;
  uploader2;
  bukti;
  bukti1 = "-";
  bukti2 = "-";
  uploading;
  isUploaded = false;

  placeholder_file_diupload_1;placeholder_file_diupload_2

  loading;
  lastImage;

  constructor(
    private http: Http,
    private router: Router,
    public platform: Platform,
    private location: Location,
    private serv: MyserviceService,
    private storage: StorageMap,
    public loadingController: LoadingController,
    private camera: Camera,
    private transfer: FileTransfer,
    private file: File,
    private filePath: FilePath,
    public toastCtrl: ToastController,
    public alertController: AlertController
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
   //upload file
   this.setupUploader1();
   this.setupUploader2();
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
        this.isUploaded = true;
      }else if(enumx=="2"){
        this.isUploaded = true;
        this.bukti2 = json.message;
        this.placeholder_file_diupload_2 = json.message;
      }
    }, err => {
      this.loadingController.dismiss();
      this.presentToast('Error while uploading file.');
      console.log(err);
    });
  }


  setupUploader1() {
      this.uploader1 = new FileUploader({  
        url: this.serv.base_url + "upload_bukti",
        method: 'POST',
        autoUpload:true,
      });
      this.uploader1.onBeforeUploadItem = (item: FileItem) => {
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
          this.uploader1.options.additionalParameter = {
              name: item.file.name,
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
          this.isUploaded = true;
          this.loadingController.dismiss();
          this.placeholder_file_diupload_1 = response_json.message;
          alert("upload 1");
        }else{
          alert(response_json.message);
        }
        //console.log("--uploader.getNotUploadedItems().length: " + this.uploader.getNotUploadedItems().length);
    };
  }
  setupUploader2() {
      this.uploader2 = new FileUploader({  
        url: this.serv.base_url + "upload_bukti",
        method: 'POST',
        autoUpload:true,
      });
      this.uploader2.onBeforeUploadItem = (item: FileItem) => {
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
          this.uploader2.options.additionalParameter = {
              name: item.file.name,
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
          this.isUploaded = true;
          this.loadingController.dismiss();
          this.placeholder_file_diupload_2 = response_json.message;
          alert("upload 2");
        }else{
          alert(response_json.message);
        }
        //console.log("--uploader.getNotUploadedItems().length: " + this.uploader.getNotUploadedItems().length);
    };
  }
  ngOnInit() {
  }
  getSubtitle(){
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      var response = data.json();
      if(this.bahasa=="id"){
        this.subtitle_nama = response.id.REGISTER_NAMA;
        this.subtitle_hp = response.id.REGISTER_HP;
        this.subtitle_alamat = response.id.REGISTER_ALAMAT;
        this.subtitle_tempat = response.id.REGISTER_TEMPAT;
        this.subtitle_tgl = response.id.REGISTER_TGL;
        this.subtitle_ktp = response.id.REGISTER_KTP;
        this.button_register = response.id.button_register;
        this.subtitle_required = response.id.subtitle_required;
        this.SUBTITLE_BACK = response.id.subtitle_back;
      }else if(this.bahasa=="en"){
        this.subtitle_nama = response.en.REGISTER_NAMA;
        this.subtitle_hp = response.en.REGISTER_HP;
        this.subtitle_alamat = response.en.REGISTER_ALAMAT;
        this.subtitle_tempat = response.en.REGISTER_TEMPAT;
        this.subtitle_tgl = response.en.REGISTER_TGL;
        this.subtitle_ktp = response.en.REGISTER_KTP;
        this.button_register = response.en.button_register;
        this.subtitle_required = response.en.subtitle_required;
        this.SUBTITLE_BACK = response.en.subtitle_back;
      }else if(this.bahasa=="ch"){
        this.subtitle_nama = response.ch.REGISTER_NAMA;
        this.subtitle_hp = response.ch.REGISTER_HP;
        this.subtitle_alamat = response.ch.REGISTER_ALAMAT;
        this.subtitle_tempat = response.ch.REGISTER_TEMPAT;
        this.subtitle_tgl = response.ch.REGISTER_TGL;
        this.subtitle_ktp = response.ch.REGISTER_KTP;
        this.button_register = response.ch.button_register;
        this.subtitle_required = response.ch.subtitle_required;
        this.SUBTITLE_BACK = response.ch.subtitle_back;
      }
      //console.log(response);
    });
  }
  survey(){
    this.router.navigateByUrl('/survey');
  }
  booking(){
    this.router.navigateByUrl('/berhasil');
  }
  myBackButton(){
    //this.location.back();
    this.router.navigateByUrl('/login');
  }
  doRegister(){
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
    
    body.append('nama', this.nama);
    body.append('hp', this.hp);
    body.append('email', this.email);
    body.append('ktp', this.ktp);
    // body.append('foto', this.bukti1);
    body.append('foto_ktp', this.bukti2);
    body.append('fcm_token', this.serv.fcm_token);

    // body.append('alamat', this.alamat);
    // body.append('tempat', this.tempat);
    // body.append('tgl', this.tgl);

    this.http.post(this.serv.base_url+"register", body, requestOptions)
    .subscribe(data => {
      this.loadingController.dismiss();
      var response = data.json();
      //console.log(response);

        if(response.status=="Failed"){
          const alert = this.alertController.create({
          header: response.status,
          message: response.message+" "+this.subtitle_required,
          buttons: ['Ok']}).then(alert=> alert.present());
        }else{
          const alert = this.alertController.create({
          header: response.status,
          message: "Register Success",
          buttons: ['Ok']}).then(alert=> alert.present());
          this.router.navigateByUrl('/login');
          //this.location.back();
        }
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
  }
  private presentToast(text) {
    
  }
}
