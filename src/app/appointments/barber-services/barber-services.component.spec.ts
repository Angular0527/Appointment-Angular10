import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberServicesComponent } from './barber-services.component';

describe('BarberServicesComponent', () => {
  let component: BarberServicesComponent;
  let fixture: ComponentFixture<BarberServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarberServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
