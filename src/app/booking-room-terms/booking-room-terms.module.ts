import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BookingRoomTermsPage } from './booking-room-terms.page';

const routes: Routes = [
  {
    path: '',
    component: BookingRoomTermsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BookingRoomTermsPage]
})
export class BookingRoomTermsPageModule {}
