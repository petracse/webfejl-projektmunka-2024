import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";



export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);

  const user = JSON.parse(localStorage.getItem('user') as string);

  if (authService.currentUserSig() === null) {

    inject(Router).navigate(['login']);
    return false;
  } else if (authService.currentUserSig() ===  undefined){
    return false;
  }
  console.log(user.uid);
  return true;
};


