import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBookingPage } from './list-booking.page';

describe('ListBookingPage', () => {
  let component: ListBookingPage;
  let fixture: ComponentFixture<ListBookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBookingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
