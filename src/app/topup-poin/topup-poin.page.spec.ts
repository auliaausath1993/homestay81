import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupPoinPage } from './topup-poin.page';

describe('TopupPoinPage', () => {
  let component: TopupPoinPage;
  let fixture: ComponentFixture<TopupPoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopupPoinPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupPoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
