import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCalendarPage } from './popup-calendar.page';

describe('PopupCalendarPage', () => {
  let component: PopupCalendarPage;
  let fixture: ComponentFixture<PopupCalendarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupCalendarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
