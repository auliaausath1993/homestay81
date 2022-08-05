import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BerhasilPage } from './berhasil.page';

describe('BerhasilPage', () => {
  let component: BerhasilPage;
  let fixture: ComponentFixture<BerhasilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BerhasilPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerhasilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
