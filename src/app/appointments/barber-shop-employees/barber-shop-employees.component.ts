import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Barber } from '../appointemnts.inteface';
import { BarberShopEmployeesService } from './barber-shop-employees-service';

@Component({
  selector: 'app-barber-shop-employees',
  templateUrl: './barber-shop-employees.component.html',
  styleUrls: ['./barber-shop-employees.component.css']
})
export class BarberShopEmployeesComponent implements OnInit {
  @Output() navToCheckout: EventEmitter<any> = new EventEmitter();

  barbersService: Barber[] = []
  constructor(private barberEmployeeService : BarberShopEmployeesService) { }

  ngOnInit(): void {
    this.barberEmployeeService.getEmployees().subscribe((data) => {
      this.barbersService = data;
    })
  }

onReserveEmployee (barberName: String) {
  this.navToCheckout.emit(barberName)
  console.log(barberName);
}
}
