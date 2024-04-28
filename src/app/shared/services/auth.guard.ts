import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";



export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {

  const user = JSON.parse(localStorage.getItem('user') as string);

  if (user === null) {

    inject(Router).navigate(['login']);
    return false;
  }
  
  return true;
};


