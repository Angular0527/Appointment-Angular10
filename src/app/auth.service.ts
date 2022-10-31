import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) { }


  createUser(email: string,password: string) {
    this.auth.createUserWithEmailAndPassword(email,password).then((user) => {
      return user;
    })
  }

  signInUser(email:string, password: string) {
    this.auth.signInWithEmailAndPassword(email,password).then((user) => {
      console.log(user);
    })
  }
}
