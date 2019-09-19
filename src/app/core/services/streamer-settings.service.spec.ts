import { TestBed } from '@angular/core/testing';

import { StreamerSettingsService } from './streamer-settings.service';

describe('StreamerSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StreamerSettingsService = TestBed.get(StreamerSettingsService);
    expect(service).toBeTruthy();
  });
});
