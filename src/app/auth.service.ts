import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new Subject<User>()
  constructor(private auth: AngularFireAuth, private router: Router) { }


  createUser(email: string,password: string) {
    this.auth.createUserWithEmailAndPassword(email,password).then((user) => {
      this.authUser(user);
      // this.router.navigate(['/appointments']);
    })
  }

  signInUser(email:string, password: string) {
    this.auth.signInWithEmailAndPassword(email,password).then((user: any) => {
      this.authUser(user);
    })
  }

  signOutUser() {
    this.auth.signOut().then(() =>{
      localStorage.removeItem('token')
      this.router.navigate(['/']);
    })
  }

  private authUser (user: any) {
    const userCredinatal = user!.user
    const email = userCredinatal.email
    const uid = userCredinatal.uid
    const token = userCredinatal.auth.currentUser.accessToken;
    const tokenExpiration = new Date(new Date().getTime() + userCredinatal.auth.currentUser.stsTokenManager.expirationTime * 1000)
    const newUser = new User(email,uid,token,tokenExpiration);
    localStorage.setItem('token', token);
    this.router.navigate(['/appointments']);
    this.user.next(newUser);
  }
}
