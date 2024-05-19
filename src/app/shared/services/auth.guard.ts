import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {

  const user = JSON.parse(localStorage.getItem('user') as string);

  if (user) {
    return true;

  }
  inject(Router).navigate(['login']);
  return false;

};


export const checkoutGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const user = JSON.parse(localStorage.getItem('user') as string);

  // Megkeressük az összes clickCount_ kezdetű elemet a localStorage-ban
  const clickCountKeys = Object.keys(localStorage).filter(key => key.startsWith('clickCount_'));

  // Ha egyik sem létezik, átirányítjuk a felhasználót a /home oldalra
  if (clickCountKeys.length === 0) {
    inject(Router).navigate(['/home']);
    return false;
  }

  if (user) {
    return true;
  }

  inject(Router).navigate(['login']);
  return false;
};

