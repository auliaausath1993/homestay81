import { LoadingController, AlertController } from '@ionic/angular';
import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, Route, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CeiboShare } from 'ng2-social-share';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage implements OnInit {
  loading;
  bahasa;bahasa_name;
  id;data;foto;fasilitas;
  base;
  title;tgl;news;

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
    this.base           = this.serv.base_url_img;

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
        this.getData();
    });
  }
  ngOnInit() {
  }
  getSubtitle(){
    this.http.get('assets/data/subtitles.json').subscribe(data => {
      var response = data.json();
      if(this.bahasa=="id"){
      }else if(this.bahasa=="en"){
      }else if(this.bahasa=="ch"){
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

    this.http.post(this.serv.base_url+"detail_news", body, requestOptions)
    .subscribe(data => {
        this.loadingController.dismiss();
        //console.log(data);
        var response = data.json();

        this.data   = response;
        this.foto   = response.data.image;
        this.title  = response.data.title;
        this.news   = response.data.news;
        this.tgl    = response.data.created_at;

        //console.log(this.list_foto);
      }, error => {
        this.loadingController.dismiss();
        //console.log(error);
    });
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