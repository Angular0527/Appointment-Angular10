import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User = {
    email: '',
    password: '',
    uid: '',
    _token: '',
    _tokenExpirationTime:new Date()
  };

  constructor(private auth: AngularFireAuth, private router: Router) { }


  createUser(email: string,password: string) {
   return from(this.auth.createUserWithEmailAndPassword(email,password))
  }

  signInUser(email:string , password: string ) {
   return from(this.auth.signInWithEmailAndPassword(email,password));
  }

  signOutUser() {
    return from(this.auth.signOut())
  };

  getToken () : string {
    return localStorage.getItem('token') || '';
  }
}
 