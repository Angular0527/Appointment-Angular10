import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberShopEmployeesComponent } from './barber-shop-employees.component';

describe('BarberShopEmployeesComponent', () => {
  let component: BarberShopEmployeesComponent;
  let fixture: ComponentFixture<BarberShopEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarberShopEmployeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberShopEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
