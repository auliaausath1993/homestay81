import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopCalendar2Page } from './pop-calendar2.page';

describe('PopCalendar2Page', () => {
  let component: PopCalendar2Page;
  let fixture: ComponentFixture<PopCalendar2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopCalendar2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopCalendar2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
