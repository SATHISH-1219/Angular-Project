import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetpswdComponent } from './forgetpswd.component';

describe('ForgetpswdComponent', () => {
  let component: ForgetpswdComponent;
  let fixture: ComponentFixture<ForgetpswdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetpswdComponent]
    });
    fixture = TestBed.createComponent(ForgetpswdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
