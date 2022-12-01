import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAppointmentComponent } from './show-appointment.component';

describe('ShowAppointmentComponent', () => {
  let component: ShowAppointmentComponent;
  let fixture: ComponentFixture<ShowAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAppointmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
