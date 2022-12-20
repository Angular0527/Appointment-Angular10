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

  constructor(private scheduleService: ScheduleService, private authService: AuthService, private router: Router) {

   }

  ngOnInit(): void {
    this.email = localStorage.getItem('email');
    this.scheduleService.appointment.subscribe((response) => {
      this.appointments = [];
      this.backendResponse = response;
      Object.values(response).forEach((val) => {
        if (val.email === this.email) {
          this.appointments.push(val);
        }
      })
      const datePipe = new DatePipe('en-US');
      const todayDate = datePipe.transform(new Date(),'yyyy-MM-dd') || ''
      const filteredResult =  this.appointments.filter((entry) => entry.date >= todayDate);
      this.dataSource = filteredResult
      filteredResult.forEach(() => {
        this.selectedValue.push();
      })
      this.scheduleArray = [...this.schedule];
    })
  }

  onToogleButtonChangeEvent(event: any)  {
    const appointmentsData = [...this.appointments];
    const datePipe = new DatePipe('en-US');
    const todayDate = datePipe.transform(new Date(),'yyyy-MM-dd') || ''
    if(event.value === "future") {
      this.dataSource = appointmentsData.filter((entry) => entry.date >= todayDate);
      this.showButtons = true;
    } else {
      this.dataSource = appointmentsData.filter((entry) => entry.date < todayDate);
      this.showButtons = false;
    }
  }


  onDeleteEntry (entryData : any) {
    const appointmentsData = [...this.appointments];
    const objectKey = this.getEntryName(entryData);
    const datePipe = new DatePipe('en-US');
    const todayDate = datePipe.transform(new Date(),'yyyy-MM-dd') || ''
    this.scheduleService.deleteAppointment(objectKey).subscribe(() => {
      this.getAppointemnts();
    })

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
    const entryName = this.getEntryName(element);
   let updatedObject = {
    barber: element.barber,
    date: this.dateChanged,
    email: element.email,
    hour: this.selectedValue[index],
    name: element.name,
    service: element.service
   }
   this.scheduleService.updateAppointment(updatedObject,entryName).subscribe((result) => {

    this.getAppointemnts();
    this.viewMode = 'normalMode'
   })
  }

  getAppointemnts() {
    this.scheduleService.getAppointments().subscribe((result) => {
      this.scheduleService.appointment.next(result);

    });
  }

  onDisableValue(index: number) {
    console.log(index);
  }

  onSelectionChange(element : any) {
    if(this.dateChanged !== '') {
      this.scheduleArray = [...this.schedule];
      this.appointments.filter((entry) => entry.barber === this.barber && entry.date === element.date).forEach((entry) => {
       this.scheduleArray.forEach((value,index) => {
         if(value.value == entry.hour) {
           this.scheduleArray.splice(index,1);
         }
       })
      })
    }
  }

  excludeWeekendDays = (date: any): boolean => {
    if(date !== undefined) {
      const day = date.weekday();
      return day !== 0 && day !== 6;
    }
    return false;

  }

  onDateChanged(date: any,  index: number) {
    this.selectedValue[index] = 0;
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform( date.value._d,'yyyy-MM-dd') || '';
    this.dateChanged = formattedDate;
    const todayDate = datePipe.transform(new Date(),'yyyy-MM-dd') || ''
   this.scheduleArray = [...this.schedule];
   this.appointments.filter((entry) => entry.barber === this.barber && entry.date === formattedDate).forEach((entry) => {
    this.scheduleArray.forEach((value,index) => {
      if(value.value == entry.hour) {
        this.scheduleArray.splice(index,1);
      }
    })
   })

    console.log(date);
  }

  onLogOut () {
    this.authService.signOutUser();
  }


  onCreateAppoitment() {
    this.router.navigate(['/appointments']);
  }



}
function getElementById(id: string | undefined) {
  throw new Error('Function not implemented.');
}

