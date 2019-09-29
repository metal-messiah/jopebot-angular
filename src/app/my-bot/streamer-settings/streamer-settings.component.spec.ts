import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamerSettingsComponent } from './streamer-settings.component';

describe('StreamerSettingsComponent', () => {
  let component: StreamerSettingsComponent;
  let fixture: ComponentFixture<StreamerSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
