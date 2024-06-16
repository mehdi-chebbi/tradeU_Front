import { TestBed } from '@angular/core/testing';

import { BienserviceService } from './bienservice.service';

describe('BienserviceService', () => {
  let service: BienserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BienserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
