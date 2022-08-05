import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSurveyPage } from './list-survey.page';

describe('ListSurveyPage', () => {
  let component: ListSurveyPage;
  let fixture: ComponentFixture<ListSurveyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSurveyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSurveyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
