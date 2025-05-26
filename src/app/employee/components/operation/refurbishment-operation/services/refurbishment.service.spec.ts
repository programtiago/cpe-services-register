import { TestBed } from '@angular/core/testing';

import { RefurbishmentService } from './refurbishment.service';

describe('RefurbishmentService', () => {
  let service: RefurbishmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefurbishmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
