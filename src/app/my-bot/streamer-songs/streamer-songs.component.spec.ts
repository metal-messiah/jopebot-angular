import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamerSongsComponent } from './streamer-songs.component';

describe('StreamerSongsComponent', () => {
  let component: StreamerSongsComponent;
  let fixture: ComponentFixture<StreamerSongsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamerSongsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamerSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
