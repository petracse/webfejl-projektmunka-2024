import {inject, Injectable, signal} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user
} from "@angular/fire/auth";
import {from, Observable} from "rxjs";
import {User} from "../interfaces/user.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserSig = signal<User | null | undefined>(undefined);
  user$ = user(this.firebaseAuth);

  constructor(private firebaseAuth: Auth) {
    this.user$.subscribe(user => {
      if (user) {
        this.currentUserSig.set({
          email: user.email!,
          username: user.displayName!
        });
      } else {
        this.currentUserSig.set(null);
      }
    });
  }

  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email, password).
    then(response => updateProfile(response.user, { displayName: username }))
    return from(promise);
  }

  isUserLoggedIn(): boolean {
    return !!this.currentUserSig();
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => { });
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }
}
