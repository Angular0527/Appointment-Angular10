import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  createAccountForm: FormGroup ;
  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;
  constructor(private auth: AngularFireAuth) {
    this.createAccountForm = new FormGroup({
    'email': new FormControl('', [Validators.required, Validators.email]),
    'password':new FormControl('', [Validators.required, Validators.minLength(5)]),
  })}

  ngOnInit(): void {
    // this.createAccountForm = new FormGroup({
    //   'email': new FormControl('', [Validators.required, Validators.email]),
    //   'password':new FormControl('', [Validators.required, Validators.minLength(5)]),
    // })
  }
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';

}
onRegister() {
  const email = this.createAccountForm.value.email;
  const password = this.createAccountForm.value.password
  this.auth.createUserWithEmailAndPassword(email,password).then((user) => {
    console.log(user);
  })
  console.log(this.createAccountForm);
}
}
