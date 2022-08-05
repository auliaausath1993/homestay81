import { NgxImgZoomModule } from 'ngx-img-zoom';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PopupImagePage } from './popup-image.page';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { PhotoGalleryModule } from '@twogate/ngx-photo-gallery'
 
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};
const routes: Routes = [
  {
    path: '',
    component: PopupImagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PinchZoomModule,
    SwiperModule,
    NgxImgZoomModule,
    PhotoGalleryModule
  ],
  declarations: [PopupImagePage],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class PopupImagePageModule {}
