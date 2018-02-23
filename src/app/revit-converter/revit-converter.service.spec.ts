import { TestBed, inject } from '@angular/core/testing';

import { RevitConverterService } from './revit-converter.service';

describe('RevitConverterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevitConverterService]
    });
  });

  it('should be created', inject([RevitConverterService], (service: RevitConverterService) => {
    expect(service).toBeTruthy();
  }));
});
