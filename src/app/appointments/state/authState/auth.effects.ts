import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { withLatestFrom, mergeMap, from, map, catchError, of, throwError, switchMap } from "rxjs";
import { AuthService } from "src/app/auth.service";
import { User } from "src/app/user.model";
import { AppState } from "../app.state";
import * as AuthAction from './auth.actions'
import { selectAuthToken } from './auth.selectors'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserCredential } from "firebase/auth";
import { Router } from "@angular/router";





@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private store: Store<AppState>, private auth: AngularFireAuth, private authService: AuthService, private router: Router) { }


  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.registerUser),
      switchMap((data: any) => {
        return this.authService.createUser(data.email, data.password).pipe(
          map((userDetails) => {
            const userDetailsTest: any = userDetails.user || ''
            const email = userDetailsTest.email;
            const token = userDetailsTest.multiFactor.user.accessToken
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            return AuthAction.loginUserSuccess()
          }),
          catchError((error) => {
            const errorMessage = error.message;
            return of(AuthAction.registerUserFailed({ errorMessage: errorMessage }))
          })
        )
      }
      )
    )
  );


  loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.loginUser),
      switchMap((data: any) => {
        return this.authService.signInUser(data.email, data.password).pipe(
          map((userDetails) => {
            const userDetailsTest: any = userDetails.user || ''
            const email = userDetailsTest.email;
            const token = userDetailsTest.multiFactor.user.accessToken
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            return AuthAction.loginUserSuccess()
          }),
          catchError((error) => {
            const errorMessage = error.message;
            return of(AuthAction.loginUserFailed({ errorMessage: errorMessage }))
          })
        )
      }
      )
    )
  );

  logoutUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.logoutUser),
      switchMap(() => {
        return this.authService.signOutUser().pipe(
          map(() => {
            localStorage.removeItem('token')
            this.router.navigate(['/']);
          })
        )
      })
    ), { dispatch: false })
}
