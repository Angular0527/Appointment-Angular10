import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentServiceObject } from 'src/app/appointment-service-object';
import { AuthService } from 'src/app/auth.service';
import { ScheduleService } from './schedule.service';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { createAppoitment, loadAppointments } from '../state/appointmentsState/appointments.actions';
import { selectAllApointments } from '../state/appointmentsState/appointments.selectors';
import { AppointmentsState } from '../state/appointmentsState/appointments.reducers';

const moment : any = _rollupMoment || _moment;
export interface Schedule {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})


export class ScheduleComponent implements OnInit , OnChanges {
  scheduleArray : Schedule[] = [];
  testArray: Schedule[] = [];
  setData: Boolean = true;
  scheduleServiceResponse : Object = {};
  email: string | null  = '';
 @Input() barber: string = ''
 @Input() service:string = ''
  //  selectedDate: Date | string = '' ;
  selectedValue: string = '';
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
  scheduleFormGroup: FormGroup ;
  constructor(private scheduleService: ScheduleService,  private router: Router, private store: Store<any>) {
    this.scheduleFormGroup = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(5)]),
      'hour': new FormControl('', [Validators.required]),
      'date': new FormControl(moment(), [Validators.required]),
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['barber']?.currentValue !== '') {
      this.scheduleArray = [...this.schedule];
      this.scheduleFormGroup.value.hour = ''

      this.selectedValue = '';
      const nowHour = new Date().getHours();
      if(nowHour >= 16) {
        this.setSchedule(moment().add(1,'days')._d);
        this.scheduleFormGroup.get('date')?.setValue(moment().add(1,'days')._d)
      } else {
        this.setSchedule(moment()._d);
        this.scheduleFormGroup.get('date')?.setValue(moment()._d)
      }

    }

  }


  ngOnInit(): void {
    this.email = localStorage.getItem('email');
  this.store.select(selectAllApointments()).subscribe((response) => {
    if(response.length > 0 ) {
      this.scheduleServiceResponse = response[0];
      this.scheduleArray = [...this.schedule];
      const nowHour = new Date().getHours();
      if(nowHour >= 16) {
        this.setSchedule(moment().add(1,'days')._d);
        this.scheduleFormGroup.get('date')?.setValue(moment().add(1,'days')._d)
      } else {
        this.setSchedule(moment()._d);
        this.scheduleFormGroup.get('date')?.setValue(moment()._d)
      }
    }

  })


  }


  excludeWeekendDays = (date: any): boolean => {
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
  datePickerDateChanged (date: any) {
    this.scheduleFormGroup.get('date')?.setValue(date._d);
    this.scheduleFormGroup.value.hour = ''
    this.scheduleArray = [...this.schedule];
    this.setSchedule(date._d);

  }

  onFinishReservation () {
    let datePipe = new DatePipe('en-US');
    const name = this.scheduleFormGroup.value.name;
    const hour =  this.scheduleFormGroup.value.hour;
    const date = this.scheduleFormGroup.value.date
    const updateDate = datePipe.transform(date,'yyyy-MM-dd')
    // this.selectedDate
    this.barber;
    this.service;
    this.email;

    const object : any = {
      'name': name,
      'hour': hour,
      'date': updateDate,
      'barber':this.barber,
      'service':this.service,
      'email':this.email
    }

    // this.scheduleService.saveAppoitment(object).subscribe((response) => {
    //   console.log(response);
    // })
    let test = [];
    this.store.dispatch(createAppoitment(object))
    this.router.navigate(['/showAppointments']);

  }


setSchedule (date: Date ) {
  let reservedHours : any = [];
  this.testArray = [...this.scheduleArray]
  Object.values(this.scheduleServiceResponse).forEach((object) => {
    if(object.barber === this.barber && this.compateDates(date,object.date)) {
      this.scheduleArray.forEach((value,index) => {
        if(value.value == object.hour) {
          reservedHours.push(value.value);
        }
      })
    }
  })

  if (this.compateDates(date, new Date().toDateString())) {
    const nowHour = new Date().getHours()
    this.scheduleArray.forEach((value,index) => {
      if(parseInt(value.value) <= nowHour) {
        reservedHours.push(value.value);
      }
    })
  }
  this.scheduleArray = this.testArray.filter((value) => {
    return !reservedHours.includes(value.value);
  })
  reservedHours = [];


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
}
