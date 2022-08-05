import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupImagePage } from './popup-image.page';

describe('PopupImagePage', () => {
  let component: PopupImagePage;
  let fixture: ComponentFixture<PopupImagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupImagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
