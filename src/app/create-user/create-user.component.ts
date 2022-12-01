import { Component, Input, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ScheduleService } from '../appointments/schedule/schedule.service';
import { AuthService } from '../auth.service';
import { first} from 'rxjs';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  @Input()handleUser : String  = ''
  createAccountForm: FormGroup ;
  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;
  constructor(private authService: AuthService, private router: Router, private scheduleService: ScheduleService) {
    this.createAccountForm = new FormGroup({
    'email': new FormControl('', [Validators.required, Validators.email]),
    'password':new FormControl('', [Validators.required, Validators.minLength(5)]),
  })}

  ngOnInit(): void {
  }

onRegister() {
  const email = this.createAccountForm.value.email;
  const password = this.createAccountForm.value.password
  this.authService.createUser(email,password);
}

onLogin() {
  const email = this.createAccountForm.value.email;
  const password = this.createAccountForm.value.password;
  this.authService.signInUser(email,password).then((result) => {
    this.authService.authUser(result,password);
    this.scheduleService.getAppointments().pipe(first()).subscribe((result) => {
      if(result !== null) {
        this.scheduleService.appointment.next(result);
      }
    })
    this.router.navigate(['/appointments']);
  });
  setInterval(() => this.authService.signInUser().then((result) => {
    this.authService.authUser(result,password)}),3540000)
}


}


