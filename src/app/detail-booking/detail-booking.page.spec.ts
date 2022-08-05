import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBookingPage } from './detail-booking.page';

describe('DetailBookingPage', () => {
  let component: DetailBookingPage;
  let fixture: ComponentFixture<DetailBookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailBookingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
