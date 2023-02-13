import { Component, Input, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ScheduleService } from '../appointments/schedule/schedule.service';
import { AuthService } from '../auth.service';
import { first} from 'rxjs';
import { Store } from '@ngrx/store';
import { loadAppointments } from '../appointments/state/appointmentsState/appointments.actions';
import { loginUser, registerUser } from '../appointments/state/authState/auth.actions';
import { selectAuthErrorMessage, selectAuthStatus, selectAuthToken } from '../appointments/state/authState/auth.selectors';

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
  constructor(private authService: AuthService, private router: Router, private scheduleService: ScheduleService, private store: Store) {
    this.createAccountForm = new FormGroup({
    'email': new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    'password':new FormControl('', [Validators.required, Validators.minLength(5)]),
  })}
  authFailed = false;
  closeErrorDialogIcon="margin-top:0.4rem;margin-right:0.8rem;font-size:1.3rem;"
  errorMsgText= "";

  ngOnInit(): void {
  }

onRegister() {
  const email = this.createAccountForm.value.email;
  const password = this.createAccountForm.value.password
  this.store.dispatch(registerUser({email:email , password:password}))
  this.store.select(selectAuthStatus()).subscribe((data) => {
    if(data === 'successs') {
      this.store.dispatch(loadAppointments())
      this.router.navigate(['/appointments']);
    }
    else if(data === 'error') {
      this.store.select(selectAuthErrorMessage()).subscribe((error) => {
        this.errorMsgText = "User Already Exists, try to login"
        this.authFailed = true;
      })
    }
  })
}

onLogin() {
  const email = this.createAccountForm.value.email;
  const password = this.createAccountForm.value.password;
  this.store.dispatch(loginUser({email:email , password:password}))
  this.store.select(selectAuthStatus()).subscribe((data) => {
    if(data === 'successs') {
      this.store.dispatch(loadAppointments())
      this.router.navigate(['/appointments']);
    }
    else if (data === 'error') {
      this.store.select(selectAuthErrorMessage()).subscribe((err) => {
        if(err.split('not-found').length > 1) {
              this.errorMsgText = "User doesn't exist, try to register"
            } else {
              this.errorMsgText = "Invalid username or password"
            }
            this.authFailed = true;
      })
    }
  })
}


closeErrorDialog () {
  this.authFailed = false;
}


}


