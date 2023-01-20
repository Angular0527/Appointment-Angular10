import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectionList } from '@angular/material/list';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Barber } from './appointemnts.inteface';
import { AppointmentsService } from './appointments.service';
import { ScheduleService } from './schedule/schedule.service';



@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})

export class AppointmentsComponent implements OnInit {
  @ViewChild('tabs', {static: false}) tabs: MatTabGroup | undefined
  tabBarber = false;
  tabCheckout = false;
  tabSchedule = false;
  selectedService: string = ''
  selectedEmployee:string = ''
  selected = 0;


  constructor(private appointmentsService: AppointmentsService, private scheduleService: ScheduleService, private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
      this.appointmentsService.getCustomers().subscribe((data) => {
        console.log(data)
      })

  }
  onCreateAppoitment () {

  }

  onShowAppoitments () {
    this.router.navigate(['/showAppointments']);
  }


  onNavTo(selectedService: string) {
    this.selectedService = selectedService;
    this.tabBarber = true;
    this.tabs!.selectedIndex = 1;
  }

  onNavToSchedule (selectedEmployee: string) {

    this.tabSchedule = true;
    this.tabs!.selectedIndex = 2;
    this.selectedEmployee = selectedEmployee;
  }

  onSelectHour (data: any) {
    console.log(data)
  }

  onLogOut () {
    this.authService.signOutUser();
  }



}
