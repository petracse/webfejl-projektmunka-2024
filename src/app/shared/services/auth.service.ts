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
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth:Auth = inject(Auth);
  firestore: AngularFirestore = inject(AngularFirestore);

  //currentUserSig = signal<User | null | undefined>(undefined);
  user$ = user(this.firebaseAuth);

  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(response => {
      return updateProfile(response.user, { displayName: username }).then(() => {
        return this.firestore.collection('Users').doc(response.user.uid).set({
          email: email,
          username: username,
          address: {
            addressLine: '',
            city: '',
            postalCode: ''
          },
          isAdmin: false,
          name: {
            firstname: '',
            lastname: ''
          },
          profilePictureUrl: '',
          registrationDate: new Date()
        });
      });
    });

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
