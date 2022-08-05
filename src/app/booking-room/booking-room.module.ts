import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BookingRoomPage } from './booking-room.page';
import { BookingPopupPage } from '../booking-popup/booking-popup.page';

const routes: Routes = [
  {
    path: '',
    component: BookingRoomPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BookingRoomPage]
})
export class BookingRoomPageModule {}
