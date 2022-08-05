import { LoadingController, AlertController, ModalController, NavController } from '@ionic/angular';
import { MyserviceService } from './../myservice.service';
import { Component, OnInit } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router, NavigationExtras, Route, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-popup-image',
  templateUrl: './popup-image.page.html',
  styleUrls: ['./popup-image.page.scss'],
})
export class PopupImagePage implements OnInit {
  foto;id;
  list_foto;
  base;

  ar_foto = [];

  constructor(
    private http: Http,
    private router: Router,
    private location: Location,
    private serv: MyserviceService,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,) { 
    this.base           = this.serv.base_url_img;
    //get lemparan parameter dari page sebelumnya
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.id = this.router.getCurrentNavigation().extras.state.id;
        this.foto = this.router.getCurrentNavigation().extras.state.foto;
        this.list_foto = this.router.getCurrentNavigation().extras.state.list_foto;

        console.log(this.list_foto);
        for(let x = 0;x<this.list_foto.length;x++){
          this.ar_foto[x] = this.base+"vector/upload/"+this.list_foto[x].foto;
        }

        this.foto = "https://homestay81.com/backend/storage/vector/upload/"+this.foto;
      }
    });
  }

  setSwipeBackEnabled(value: boolean) {
    
  }
  async closeModal() {
    this.location.back();
  }

  backToHome(){
    let navigationExtras: NavigationExtras = {
      state: {
        id : this.id
      }
    };
    //this.router.navigate(['detail'], navigationExtras);
    this.router.navigate(['/detail'], { queryParams: { id : this.id } });
  }
  ngOnInit() {
  }

}
