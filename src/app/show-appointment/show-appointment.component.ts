import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppointmentServiceObject } from '../appointment-service-object';
import { ScheduleService } from '../appointments/schedule/schedule.service';
import { AuthService } from '../auth.service';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MatOptgroup, MatOption, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { Schedule } from '../appointments/schedule/schedule.component';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAllApointments } from '../appointments/state/appointmentsState/appointments.selectors';
import { deleteAppointment, updateAppointment } from '../appointments/state/appointmentsState/appointments.actions';
import { logoutUser } from '../appointments/state/authState/auth.actions';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-show-appointment',
  templateUrl: './show-appointment.component.html',
  styleUrls: ['./show-appointment.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class ShowAppointmentComponent implements OnInit {
  dateChanged : any = '';
  @ViewChild('hourOption', {static: false}) hourOption: MatOption | undefined;
  @ViewChild('hourSelect', {static: false}) hourSelect: MatSelect | undefined
  @ViewChild('dateSelect', {static: false}) dateSelect: MatDatepickerInput<any> | undefined
  scheduleArray : Schedule[] = [];
  barber: string  = '';
  email: string | null = '';
  appointments:AppointmentServiceObject[]  = [];
  backendResponse: any;
  showButtons: Boolean = true;
  date: FormControl = new FormControl();
  viewMode: string = 'normalMode';
  displayedColumns: string[] = ['barber', 'date', 'email', 'hour','name','service','btn'];
  hourValue: String = '9';
  selectedValue : any = [];
  selectedDateChange: any = '';

  schedule: Schedule[] = [
    {value: '9', viewValue: '9-10'},
    {value: '10', viewValue: '10-11'},
    {value: '11', viewValue: '11-12'},
    {value: '12', viewValue: '12-13'},
    {value: '13', viewValue: '13-14'},
    {value: '14', viewValue: '14-15'},
    {value: '15', viewValue: '15-16'},
    {value: '16', viewValue: '16-17'},
  ];
  dataSource: any | undefined;

  constructor(private scheduleService: ScheduleService, private authService: AuthService, private router: Router, private store: Store) {

   }

  ngOnInit(): void {
    this.email = localStorage.getItem('email');
    this.store.select(selectAllApointments()).subscribe((response) => {
      if(response.length > 0) {
        this.appointments = [];
        this.backendResponse = response[0];
        Object.values(response[0]).forEach((val) => {
          if (val.email === this.email) {
            this.appointments.push(val);
          }
        })
        const datePipe = new DatePipe('en-US');
        const todayDate = datePipe.transform(new Date(),'yyyy-MM-dd') || ''
        const filteredResult =  this.appointments.filter((entry) => entry.date >= todayDate && this.filterAppointemntsByHour(entry, todayDate, true))
                                                  .sort((a,b)=>new Date(a.date).getTime()- new Date(b.date).getTime());
        this.dataSource = filteredResult
        filteredResult.forEach(() => {
          this.selectedValue.push();
        })
        this.scheduleArray = [...this.schedule];
      }

    })
  }


  filterAppointemntsByHour (entry : any, todayDate: any, hourFlag: boolean) {
    const nowHour = new Date().getHours()
    if(hourFlag) {
      if(entry.date === todayDate && parseInt(entry.hour) < nowHour) {
        return false;
     }
    } else {
      if (entry.date === todayDate && parseInt(entry.hour) <= nowHour) {
        return false;
     }
    }

    return true;
  }

  onToogleButtonChangeEvent(event: any)  {
    const appointmentsData = [...this.appointments];
    const datePipe = new DatePipe('en-US');
    const todayDate = datePipe.transform(new Date(), 'yyyy-MM-dd') || ''
    if (event.value === "future") {
      this.dataSource = appointmentsData.filter((entry) => entry.date >= todayDate && this.filterAppointemntsByHour(entry, todayDate,true))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());;
      this.showButtons = true;
    } else {
      this.dataSource = appointmentsData.filter((entry) => entry.date <= todayDate && this.filterAppointemntsByHour(entry, todayDate, false))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());;
      this.showButtons = false;
    }
  }


  onDeleteEntry (entryData : string) {
    const appointmentsData = [...this.appointments];
    const objectKey : any = this.getEntryName(entryData);
    const datePipe = new DatePipe('en-US');
    const todayDate = datePipe.transform(new Date(),'yyyy-MM-dd') || ''
    this.store.dispatch(deleteAppointment({data: objectKey}))

  };


  private getEntryName (entryData: any) {
    let objectKey = '';
    Object.entries(this.backendResponse).forEach((val) => {
      if (val[1] === entryData) {
        objectKey = val[0];
      }
    })
    return objectKey;
  }

  onEditEntry (element: any) {
    // this.dateChanged = element.date;
    this.barber = element.barber;
    this.viewMode = 'editMode'
    this.scheduleArray = [...this.schedule];
    this.appointments.filter((entry) => entry.barber === this.barber && entry.date === element.date).forEach((entry) => {
     this.scheduleArray.forEach((value,index) => {
       if(value.value == entry.hour) {
         this.scheduleArray.splice(index,1);
       }
     })
    })

  }


  onRowClick (event: any) {
    console.log(event);
  }


  onCancelEdit() {
    this.viewMode = 'normalMode';
    this.selectedValue = [];
  }


  onSaveEntry(element: any, index: number) {
    const entryName : string = this.getEntryName(element);
   let updatedObject  = {
    barber: element.barber,
    date: this.dateChanged !== ''?  this.dateChanged : element.date,
    email: element.email,
    hour: this.selectedValue[index],
    name: element.name,
    service: element.service
   }
   this.store.dispatch(updateAppointment({id:entryName, data: updatedObject}))
   this.viewMode = 'normalMode'
  }

  getAppointemnts() {
    this.scheduleService.getAppointments().subscribe((result) => {
      this.scheduleService.appointment.next(result);

    });
  }
  onSelectionChange(element : any) {
    if(this.dateChanged == '') {
      this.scheduleArray = [...this.schedule];
      let reservedHours: any = [];
      const nowHour = new Date().getHours()
      this.appointments.filter((entry) => entry.barber === this.barber && entry.date === element.date).forEach((entry) => {
        this.scheduleArray.forEach((value, index) => {
          if (value.value == entry.hour ) {
            reservedHours.push(value.value);
          }
        })
      })

      if(this.compateDates(new Date(element.date), new Date().toDateString())) {
        this.scheduleArray.forEach((value, index) => {
          if (parseInt(value.value) <= nowHour) {
            reservedHours.push(value.value);
          }
        })
      }

     let uniqReservredHours = [...new Set(reservedHours)];

      this.scheduleArray = this.scheduleArray.filter((value) => {
        return !uniqReservredHours.includes(value.value);
      })
      reservedHours = 0;
    }
  }

  excludeWeekendDays = (date: any): boolean => {
    if(date !== undefined) {
      const todayDate = new Date();
      const yesterdayDate = todayDate.setDate(todayDate.getDate() - 1);
      const day = date.weekday();
      const nowHour = new Date().getHours();
      if(this.compateDates(date._d, new Date().toDateString())) {
            if(nowHour >= 16) {
              return false;
            }
      }
      return day !== 0 && day !== 6 && date._d > yesterdayDate;
    }
    return false;

  }

  onDateChanged(date: any, index: number) {
    this.selectedValue[index] = 0;
    let reservedHours: any = [];
    const nowHour = new Date().getHours()
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(date.value._d, 'yyyy-MM-dd') || '';
    this.dateChanged = formattedDate;
    this.selectedDateChange = date.value._d;
    const todayDate = datePipe.transform(new Date(), 'yyyy-MM-dd') || ''
    this.scheduleArray = [...this.schedule];
    this.appointments.filter((entry) => entry.barber === this.barber && entry.date === formattedDate).forEach((entry) => {
      this.scheduleArray.forEach((value, index) => {
        if (value.value == entry.hour ) {
          reservedHours.push(value.value);
        }
      })
    })

    if(this.compateDates(date.value._d, new Date().toDateString())) {
      this.scheduleArray.forEach((value, index) => {
        if (parseInt(value.value) <= nowHour) {
          reservedHours.push(value.value);
        }
      })
    }

   let uniqReservredHours = [...new Set(reservedHours)];

    this.scheduleArray = this.scheduleArray.filter((value) => {
      return !uniqReservredHours.includes(value.value);
    })
    reservedHours = 0;
  }

  onLogOut () {
    this.store.dispatch(logoutUser())
  }


  compateDates (datePickerDate : Date, objectDate: string) {
    const datePickerMonth = datePickerDate.getMonth();
    const datePickerYear = datePickerDate.getFullYear()
    const datePickerDay = datePickerDate.getDate()
    const objectDateMonth = new Date(objectDate).getMonth();
    const objectDateYear =new Date(objectDate).getFullYear();
    const objectDateDay = new Date(objectDate).getDate();
    if(datePickerMonth === objectDateMonth && datePickerYear === objectDateYear && datePickerDay === objectDateDay) {
      return true;
    }
    return false;
  }


  onCreateAppoitment() {
    this.router.navigate(['/appointments']);
  }



}
function getElementById(id: string | undefined) {
  throw new Error('Function not implemented.');
}

