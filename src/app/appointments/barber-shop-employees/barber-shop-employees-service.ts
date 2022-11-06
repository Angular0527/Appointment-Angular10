import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { Barber } from '../appointemnts.inteface';

@Injectable({
  providedIn: 'root'
})
export class BarberShopEmployeesService {
   appSubject  = new BehaviorSubject<Object>({});

  constructor(private http: HttpClient) { }

  getEmployees() : Observable<Barber[]> {
  return this.http.get<Barber[]>('https://angular-appointments-app-default-rtdb.europe-west1.firebasedatabase.app/employees.json')
  }
}
