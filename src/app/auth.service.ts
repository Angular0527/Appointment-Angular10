import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
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
    this.auth.createUserWithEmailAndPassword(email,password).then((user) => {
      this.authUser(user, password);
      // this.router.navigate(['/appointments']);
    })
  }

  signInUser(email:string = this.user!.email, password: string = this.user!.password) {
   return this.auth.signInWithEmailAndPassword(email,password);
  }

  signOutUser() {
    this.auth.signOut().then(() =>{
      localStorage.removeItem('token')
      this.router.navigate(['/']);
    })
  }

   authUser (userDetails: any, password:string = this.user!.password) {
    const userCredinatal = userDetails!.user
    const email = userCredinatal.email
    const uid = userCredinatal.uid
    const token = userCredinatal.auth.currentUser.accessToken;
    const tokenExpiration = new Date(new Date().getTime() + userCredinatal.auth.currentUser.stsTokenManager.expirationTime * 1000)
    const user: User =  { email: email, password:password, uid: uid, _token: token, _tokenExpirationTime: tokenExpiration};
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    // this.user.next(newUser);
  }

  checkToken(): boolean{
    if(!this.user._tokenExpirationTime || new Date() > this.user._tokenExpirationTime) {
    return false;
    }
    return true;
  }

  getToken () : string {
    return this.user._token || '';
  }
}
 