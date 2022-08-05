import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { KonfirmasiTopupPage } from './konfirmasi-topup.page';

const routes: Routes = [
  {
    path: '',
    component: KonfirmasiTopupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KonfirmasiTopupPage]
})
export class KonfirmasiTopupPageModule {}
