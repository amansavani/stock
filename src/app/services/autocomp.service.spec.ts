import { TestBed } from '@angular/core/testing';

import { AutocompService } from './autocomp.service';

describe('AutocompService', () => {
  let service: AutocompService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutocompService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
