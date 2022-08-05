import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyserviceService {

  //LOCAL//
  // public base:String            = "http://dev.homestay81.com/";
  // public base_url:String        = this.base+"api/";
  // public base_url_image:String  = "http://dev.homestay81.com/storage/app/";
  // public base_url_img:String    = "http://dev.homestay81.com/backend/storage/";

  //DEV//
  // public base:String            = "https://homestay.dev5.novatama.com/";
  // public base_url:String        = this.base+"api/";
  // public base_url_image:String  = "https://dev5.novatama.com/homestay/storage/app/";

  //PRODUCTION//
  public base:String            = "https://homestay81.com/backend/public/";
  public base_url:String        = this.base+"api2/";
  public base_url_image:String  = "https://homestay81.com/backend/storage/app/";
  public base_url_img:String    = "https://homestay81.com/backend/storage/";

  public bahasa             = "en";
  public bahasa_name        = "English";
  public app_name           = "Homestay";
  public app_version        = "0.0.1";
  public header_key         = "d2FrdWxpbmVybm92YXRhbWFpbmZpc2lvbg==";
  public token              = "d2FrdWxpbmVybm92YXRhbWFpbmZpc2lvbg==";
  public map_key            = "AIzaSyBaqX2OWTYyEaBbC5ER-X7YvytxdZfEUmA";
  public fcm_token          = "";


  public tgl                = "-";

  constructor() {
    //console.log('Hello Myservice Provider');
  }

  randomID(length){
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  toRp(angka){
      var rev     = parseInt(angka, 10).toString().split('').reverse().join('');
      var rev2    = '';
      for(var i = 0; i < rev.length; i++){
          rev2  += rev[i];
          if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
              rev2 += '.';
          }
      }
      return 'Rp' + rev2.split('').reverse().join('') + '';
  }
}
