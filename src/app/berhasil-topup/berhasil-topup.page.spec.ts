import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BerhasilTopupPage } from './berhasil-topup.page';

describe('BerhasilTopupPage', () => {
  let component: BerhasilTopupPage;
  let fixture: ComponentFixture<BerhasilTopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BerhasilTopupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerhasilTopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
