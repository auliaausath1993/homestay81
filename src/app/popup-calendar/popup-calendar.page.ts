import { MyserviceService } from './../myservice.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup-calendar',
  templateUrl: './popup-calendar.page.html',
  styleUrls: ['./popup-calendar.page.scss'],
})
export class PopupCalendarPage implements OnInit {
  date;
  type: 'string';

  constructor(
    private serv : MyserviceService,
    private modalCtrl: ModalController
  ) { }

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
