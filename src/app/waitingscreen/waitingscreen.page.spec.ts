import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingscreenPage } from './waitingscreen.page';

describe('WaitingscreenPage', () => {
  let component: WaitingscreenPage;
  let fixture: ComponentFixture<WaitingscreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingscreenPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingscreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
