import { MyserviceService } from './../myservice.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarComponentOptions } from 'ion2-calendar';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-pop-calendar2',
  templateUrl: './pop-calendar2.page.html',
  styleUrls: ['./pop-calendar2.page.scss'],
})
export class PopCalendar2Page implements OnInit {
  //@Input() today: any;
  public today = this.navParams.get('today');
  
  date;
  type: 'string';

  optionsRange: CalendarComponentOptions = {
    pickMode: 'single',
    from: this.today
  };
  
  constructor(
    private router: Router,
    private navParams: NavParams,
    private route: ActivatedRoute,
    private serv : MyserviceService,
    private modalCtrl: ModalController
  ) {
    console.log("today");
    console.log(this.today);

    this.optionsRange.from = this.today;
  }

  ngOnInit() {
  }
  onChange($event) {
    console.log($event);
  }
  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
 }
  async back(){
    if(this.date==undefined){
      alert("Date cannot be null");
    }else{
      console.log(this.date);
      console.log(this.formatDate(this.date));
      this.serv.tgl = this.date;
      const onClosedData: string = this.formatDate(this.date);
      await this.modalCtrl.dismiss(onClosedData);
    }
    //this.modalCtrl.dismiss(onClosedData);
  }

}
