import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBotComponent } from './my-bot.component';

describe('MyBotComponent', () => {
  let component: MyBotComponent;
  let fixture: ComponentFixture<MyBotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
