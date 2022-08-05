import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  // },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'index.html',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'detail', loadChildren: './detail/detail.module#DetailPageModule' },
  { path: 'detail_link/:id', loadChildren: './detail/detail.module#DetailPageModule' },
  { path: 'berhasil', loadChildren: './berhasil/berhasil.module#BerhasilPageModule' },
  { path: 'map', loadChildren: './map/map.module#MapPageModule' },
  { path: 'survey', loadChildren: './survey/survey.module#SurveyPageModule' },
  { path: 'list-booking', loadChildren: './list-booking/list-booking.module#ListBookingPageModule' },
  { path: 'detail-booking', loadChildren: './detail-booking/detail-booking.module#DetailBookingPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'konfirmasi', loadChildren: './konfirmasi/konfirmasi.module#KonfirmasiPageModule' },
  { path: 'waitingscreen', loadChildren: './waitingscreen/waitingscreen.module#WaitingscreenPageModule' },
  { path: 'list-survey', loadChildren: './list-survey/list-survey.module#ListSurveyPageModule' },
  { path: 'pengaturan', loadChildren: './pengaturan/pengaturan.module#PengaturanPageModule' },
  { path: 'lupa-password', loadChildren: './lupa-password/lupa-password.module#LupaPasswordPageModule' },
  { path: 'list2', loadChildren: './list2/list2.module#List2PageModule' },
  { path: 'news-detail', loadChildren: './news-detail/news-detail.module#NewsDetailPageModule' },
  { path: 'popup-image', loadChildren: './popup-image/popup-image.module#PopupImagePageModule' },
  { path: 'filter', loadChildren: './filter/filter.module#FilterPageModule' },
  { path: 'notification', loadChildren: './notification/notification.module#NotificationPageModule' },
  { path: 'topup-poin', loadChildren: './topup-poin/topup-poin.module#TopupPoinPageModule' },
  { path: 'berhasil-topup', loadChildren: './berhasil-topup/berhasil-topup.module#BerhasilTopupPageModule' },
  { path: 'konfirmasi-topup', loadChildren: './konfirmasi-topup/konfirmasi-topup.module#KonfirmasiTopupPageModule' },
  { path: 'poin-saya', loadChildren: './poin-saya/poin-saya.module#PoinSayaPageModule' },
  { path: 'terms', loadChildren: './terms/terms.module#TermsPageModule' },
  { path: 'booking-room', loadChildren: './booking-room/booking-room.module#BookingRoomPageModule' },
  { path: 'booking-popup', loadChildren: './booking-popup/booking-popup.module#BookingPopupPageModule' },
  { path: 'booking-room-terms', loadChildren: './booking-room-terms/booking-room-terms.module#BookingRoomTermsPageModule' },
  { path: 'popup-calendar', loadChildren: './popup-calendar/popup-calendar.module#PopupCalendarPageModule' },
  { path: 'pop-calendar2', loadChildren: './pop-calendar2/pop-calendar2.module#PopCalendar2PageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
