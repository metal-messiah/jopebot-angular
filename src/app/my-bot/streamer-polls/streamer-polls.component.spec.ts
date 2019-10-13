import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamerPollsComponent } from './streamer-polls.component';

describe('StreamerPollsComponent', () => {
  let component: StreamerPollsComponent;
  let fixture: ComponentFixture<StreamerPollsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamerPollsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamerPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
