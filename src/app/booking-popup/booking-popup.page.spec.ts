import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingPopupPage } from './booking-popup.page';

describe('BookingPopupPage', () => {
  let component: BookingPopupPage;
  let fixture: ComponentFixture<BookingPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingPopupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
