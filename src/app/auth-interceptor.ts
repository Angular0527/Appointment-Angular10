import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, Observable,take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //  return this.authService.user.pipe(
  //     take(1),
  //     exhaustMap(user => {
  //       if(!user) {
  //         return next.handle(user)
  //       }
  //       const token = user.token() || false;
  //       const modifiedReq = req.clone({params: new HttpParams().set('auth',token)});
  //       return next.handle(modifiedReq)
  //   }))
        const token = this.authService.getToken()
        const modifiedReq = req.clone({params: new HttpParams().set('auth', token)})
        return next.handle(modifiedReq)

  }
}
