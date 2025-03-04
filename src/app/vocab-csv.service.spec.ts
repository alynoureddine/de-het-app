import { TestBed } from '@angular/core/testing';

import { VocabCsvService } from './vocab-csv.service';

describe('VocabCsvService', () => {
  let service: VocabCsvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VocabCsvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
