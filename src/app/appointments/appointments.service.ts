import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
   appSubject  = new BehaviorSubject<Object>({});

  constructor(private http: HttpClient) { }

  getCustomers() {
  return this.http.get('https://angular-appointments-app-default-rtdb.europe-west1.firebasedatabase.app/appoitments.json')
  }
}
