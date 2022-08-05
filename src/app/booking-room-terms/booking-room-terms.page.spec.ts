import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingRoomTermsPage } from './booking-room-terms.page';

describe('BookingRoomTermsPage', () => {
  let component: BookingRoomTermsPage;
  let fixture: ComponentFixture<BookingRoomTermsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingRoomTermsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingRoomTermsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
