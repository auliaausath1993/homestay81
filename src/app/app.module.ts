import { PopupCalendarPage } from './popup-calendar/popup-calendar.page';
import { BookingRoomTermsPage } from './booking-room-terms/booking-room-terms.page';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { StorageModule } from '@ngx-pwa/local-storage';
import { HttpModule } from '@angular/http';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { NgxImgZoomModule } from 'ngx-img-zoom';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
 
import { GooglePlus } from '@ionic-native/google-plus/ngx';
 
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

import { CalendarModule } from 'ion2-calendar';
import { BookingPopupPage } from './booking-popup/booking-popup.page';
import { BerhasilTopupPage } from './berhasil-topup/berhasil-topup.page';
import { BookingRoomPage } from './booking-room/booking-room.page';
import { FormsModule } from '@angular/forms';
import { PopCalendar2Page } from './pop-calendar2/pop-calendar2.page';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { DatePipe } from '@angular/common';
// import {NgxImageCompressService} from 'ngx-image-compress';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("919872359812-e1vg1fv75dfvouln4l51q3iqa0igf0k2.apps.googleusercontent.com")
  }
]);
export function provideConfig() {
  return config;
}


let pages: any = [
  AppComponent,
  BookingPopupPage,
  PopupCalendarPage,
  PopCalendar2Page,
  // BerhasilTopupPage,
  // BookingRoomPage
];

@NgModule({
  declarations: pages,
 /*  declarations: [AppComponent,
    BookingPopupPage,
    PopupCalendarPage,
    PopCalendar2Page,
    BerhasilTopupPage,
    BookingRoomPage
    //BookingRoomTermsPage
  ], */
  entryComponents: [
    BookingPopupPage,
    PopupCalendarPage,
    PopCalendar2Page
    //BookingRoomTermsPage
  ],
  imports: [
    FormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    StorageModule.forRoot({ IDBNoWrap: true }),
    HttpModule,
    NgxIonicImageViewerModule,
    ShareButtonsModule,
    NgxImgZoomModule,
    SocialLoginModule,
    CalendarModule
  ],
  providers: [
    StatusBar,
    GooglePlus,
    SplashScreen,
    Geolocation,
    NativeGeocoder,
    SocialSharing,
    Camera,
    File,
    FCM,
    FirebaseX,
    FileTransfer,
    FilePath,
    DatePipe,
    // NgxImageCompressService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: SWIPER_CONFIG, useValue: DEFAULT_SWIPER_CONFIG },
    { provide: AuthServiceConfig, useFactory: provideConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
