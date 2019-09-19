import { TestBed } from '@angular/core/testing';

import { StreamerUserPrivilegesService } from './streamer-user-privileges.service';

describe('StreamerUserPrivilegesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StreamerUserPrivilegesService = TestBed.get(StreamerUserPrivilegesService);
    expect(service).toBeTruthy();
  });
});
