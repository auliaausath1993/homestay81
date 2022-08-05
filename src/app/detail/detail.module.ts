import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailPage } from './detail.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { ShareButtonsModule } from '@ngx-share/buttons';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { PhotoGalleryModule } from '@twogate/ngx-photo-gallery';

const routes: Routes = [
  {
    path: '',
    component: DetailPage
  }
];

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgxIonicImageViewerModule,
    ShareButtonsModule,
    SwiperModule,
    PhotoGalleryModule
  ],
  declarations: [DetailPage],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class DetailPageModule {}
