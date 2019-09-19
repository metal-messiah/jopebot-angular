import { TestBed } from '@angular/core/testing';

import { StreamerSongsService } from './streamer-songs.service';

describe('StreamerSongsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StreamerSongsService = TestBed.get(StreamerSongsService);
    expect(service).toBeTruthy();
  });
});
