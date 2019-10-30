import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutsCardComponent } from './shortcuts-card.component';

describe('ShortcutsCardComponent', () => {
  let component: ShortcutsCardComponent;
  let fixture: ComponentFixture<ShortcutsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShortcutsCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
