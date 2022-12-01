import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate,Router,RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable,take,exhaustMap, map } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>  {

    const isAuth = this.authService.getToken();
   if(isAuth) {
      return true;
   }
   return this.router.navigate(['']);

  }


}
