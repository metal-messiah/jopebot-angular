import { TestBed } from '@angular/core/testing';

import { SnackbarQueueService } from './snackbar-queue.service';

describe('SnackbarQueueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SnackbarQueueService = TestBed.get(SnackbarQueueService);
    expect(service).toBeTruthy();
  });
});
