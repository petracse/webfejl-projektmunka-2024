import {inject, Injectable, signal} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, updatePassword,
  updateProfile,
  EmailAuthProvider,
  user, reauthenticateWithCredential
} from "@angular/fire/auth";
import {from, Observable, throwError} from "rxjs";
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

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    const user = this.firebaseAuth.currentUser;
    if (!user) {
      return new Observable(observer => {
        observer.error('User is not logged in.');
        observer.complete();
      });
    }

    const credential = EmailAuthProvider.credential(user.email as string, oldPassword);
    return new Observable(observer => {
      reauthenticateWithCredential(user, credential)
        .then(() => {
          observer.next();
          return updatePassword(user, newPassword);
        }).catch(error => {
          observer.error('Authentication failed.');
          observer.complete();
        });
    });
  }
}
