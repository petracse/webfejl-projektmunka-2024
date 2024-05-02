import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, updatePassword,
  updateProfile,
  EmailAuthProvider,
  user, reauthenticateWithCredential, updateEmail, authState
} from "@angular/fire/auth";
import {from, map, Observable, of, switchMap, throwError} from "rxjs";
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

  getCurrentUserUsername(): Observable<string | null> {
    return authState(this.firebaseAuth).pipe(
      map(user => user ? user.displayName : null)
    );
  }

  isUsernameExists(username: string): Observable<boolean> {
    return this.getCurrentUserUsername().pipe(
      switchMap(currentUserUsername => {
        if (currentUserUsername && currentUserUsername === username) {
          return of(false); // Ha a bejelentkezett felhasználó neve megegyezik a paraméterrel
        } else {
          return this.firestore.collection('Users', ref=> ref.
          where('username', '==', username))
            .valueChanges()
            .pipe(
              map(users => users.length > 0)
            );
        }
      })
    );
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
          return updatePassword(user, newPassword);
        }).
      then(() => {
        observer.next();
        observer.complete();
      }).
      catch(error => {
          observer.error('Authentication failed.');
          observer.complete();
        });
    });
  }

  changePersonalData(password: string, newUsername: string, newEmail: string): Observable<void> {
    const user = this.firebaseAuth.currentUser;
    if (!user) {
      return new Observable(observer => {
        observer.error('User is not logged in.');
        observer.complete();
      });
    }/*
    if (this.isUsernameExists(newUsername)) {
      return new Observable(observer => {
        observer.error('Username is already taken.');
        observer.complete();
      });
    }*/

    const credential = EmailAuthProvider.credential(user.email as string, password);
    return new Observable(observer => {
      reauthenticateWithCredential(user, credential)
        .then((response) => {
          return updateEmail(response.user, newEmail).then(() => {
            return this.firestore.collection('Users').doc(response.user.uid).update({
              email: newEmail,
            });

          });
        })
        .then(() => {
          return updateProfile(user, { displayName: newUsername }).then(() => {
            return this.firestore.collection('Users').doc(user.uid).update({
              username: newUsername,
            });
          });
        })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => {
          if (error.code === 'auth/invalid-credential') {
            observer.error('Incorrect password.');
          } else if (error.code === 'auth/email-already-exists') {
            observer.error('Email is already in use.');
          } else {
            observer.error('Unknown error: ' + error.message);
          }
          observer.complete();
        });
    });
  }
}
