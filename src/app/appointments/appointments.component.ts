import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { MatTabGroup } from '@angular/material/tabs';
import { AuthService } from '../auth.service';
import { Barber } from './appointemnts.inteface';
import { AppointmentsService } from './appointments.service';

export interface AppoitmentsTableData {
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
}


const ELEMENT_DATA: AppoitmentsTableData[] = [
  {Monday: '09-10', Tuesday:'09-10' ,Wednesday: '09-10',Thursday:'09-10', Friday:'09-10'},
  {Monday: '10-11', Tuesday:'10-11' ,Wednesday: '',Thursday:'10-11', Friday:'10-11'},
  {Monday: '11-12', Tuesday:'11-12' ,Wednesday: '11-12',Thursday:'11-12', Friday:'11-12'},
  {Monday: '11-12', Tuesday:'11-12' ,Wednesday: '11-12',Thursday:'11-12', Friday:'11-12'},
  {Monday: '09-10', Tuesday:'09-10' ,Wednesday: '09-10',Thursday:'09-10', Friday:'09-10'},
];

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
  selectedService: String = ''
  selectedEmployee:String = ''
  selected = 0;
  data = ELEMENT_DATA;
  displayedColumns: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  constructor(private appointmentsService: AppointmentsService, private auth: AuthService) {
  }

  ngOnInit(): void {

    // this.auth.user.subscribe(() => {
      this.appointmentsService.getCustomers().subscribe((data) => {
        console.log(data)
      })
    // })
  }
  onCreateAppoitment () {

  }

  onShowAppoitments () {

  }


  onNavTo(selectedService: string) {
    this.selectedService = selectedService;
    this.tabBarber = true;
    this.tabs!.selectedIndex = 1;
  }

  onNavToSchedule (selectedEmployee: string) {
    this.selectedService = selectedEmployee;
    this.tabSchedule = true;
    this.tabs!.selectedIndex = 2;
  }

  onSelectHour (data: any) {
    console.log(data)
  }


}
