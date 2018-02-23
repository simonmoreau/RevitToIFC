import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevitConverterComponent } from './revit-converter.component';

describe('RevitConverterComponent', () => {
  let component: RevitConverterComponent;
  let fixture: ComponentFixture<RevitConverterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevitConverterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevitConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
