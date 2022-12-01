import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppointmentServiceObject } from 'src/app/appointment-service-object';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  appointment =  new BehaviorSubject<Object>('')
  constructor(private http: HttpClient) { }

  saveAppointments (data: Object) {
   return  this.http.put('https://angular-appointments-app-default-rtdb.europe-west1.firebasedatabase.app/schedule.json',[data])
  }

  saveAppointment(data: object) {
   return this.http.post<AppointmentServiceObject>('https://angular-appointments-app-default-rtdb.europe-west1.firebasedatabase.app/schedule.json',data);
  }

  getAppointments () {
   return this.http.get<AppointmentServiceObject>('https://angular-appointments-app-default-rtdb.europe-west1.firebasedatabase.app/schedule.json')
  }

  deleteAppointment (key: string) {
    return this.http.delete<AppointmentServiceObject>(`https://angular-appointments-app-default-rtdb.europe-west1.firebasedatabase.app/schedule/${key}.json`);
  }

  updateAppointment (data: object, key: string) {
    return this.http.patch<AppointmentServiceObject>(`https://angular-appointments-app-default-rtdb.europe-west1.firebasedatabase.app/schedule/${key}.json`,data);
  }
}
