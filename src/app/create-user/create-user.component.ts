import { Component, Input, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../auth.service';


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
  constructor(private authService: AuthService) {
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
  this.authService.signInUser(email,password);
}
}


