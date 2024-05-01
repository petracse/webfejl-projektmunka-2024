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
import {User} from "../models/user.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth)

  currentUserSig = signal<User | null | undefined>(undefined);
  user$ = user(this.firebaseAuth);

  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email, password).
    then(response => updateProfile(response.user, { displayName: username }))
    return from(promise);
  }

  isUserLoggedIn(): boolean {
    return !!this.firebaseAuth.currentUser;
  }

  getUsername(): string | null | undefined {
    return this.firebaseAuth.currentUser?.displayName;
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
