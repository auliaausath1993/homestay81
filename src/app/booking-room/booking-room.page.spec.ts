import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingRoomPage } from './booking-room.page';

describe('BookingRoomPage', () => {
  let component: BookingRoomPage;
  let fixture: ComponentFixture<BookingRoomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingRoomPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
