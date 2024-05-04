import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, updatePassword,
  updateProfile,
  EmailAuthProvider,
  user, reauthenticateWithCredential, updateEmail
} from "@angular/fire/auth";
import {from, map, Observable} from "rxjs";
import {AngularFirestore, DocumentSnapshot, DocumentSnapshotExists} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth:Auth = inject(Auth);
  firestore: AngularFirestore = inject(AngularFirestore);

  //currentUserSig = signal<User | null | undefined>(undefined);
  user$ = user(this.firebaseAuth);

  loadBooks(): Observable<any[]> {
    return this.firestore.collection('Books').valueChanges();
  }


  register(email: string, username: string, password: string): Observable<void> {
    return new Observable<void>(observer => {
      this.isUsernameExists(username).subscribe(usernameExists => {
        if (usernameExists) {
          observer.error(new Error('Username is already taken.'));
          observer.complete();

        } else {
          const promise = createUserWithEmailAndPassword(
            this.firebaseAuth,
            email,
            password
          ).then(response => {
            return updateProfile(response.user, { displayName: username }).then(() => {
              return this.firestore.collection('Users').doc(response.user.uid).set({
                email: email,
                username: username,
                isAdmin: false,
                registrationDate: new Date()
              });
            });
          });

          promise.then(() => {
            observer.next();
            observer.complete();
          }).catch(error => {
            observer.error(error);
            observer.complete();
          });
        }
      });
    });
  }


  isUsernameExists(username: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const currentUser = this.firebaseAuth.currentUser;
      if (currentUser && currentUser.displayName === username) {
        observer.next(false);
        observer.complete();
      } else {
        this.firestore.collection('Users', ref => ref.where('username', '==', username)).valueChanges().subscribe(users => {
          observer.next(users.length > 0);
          observer.complete();
        });
      }
    });
  }

  isUserLoggedIn(): boolean {
    return !!this.firebaseAuth.currentUser;
  }

  getUsername(): string | null | undefined {
    return this.firebaseAuth.currentUser?.displayName;
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

  deleteContactInfo(userDataSnapshot: any): Observable<void> {
    const currentUserUid = this.firebaseAuth.currentUser?.uid;
    const userData = userDataSnapshot.data();
    console.log(userDataSnapshot.data().username);
    if (currentUserUid) {
      return from(
        this.firestore.collection('Users').doc(currentUserUid).set({
          isAdmin: userData.isAdmin,
          username: userData.username,
          email: userData.email,
          registrationDate: userData.registrationDate
        })
      );
    } else {
      return new Observable<void>(observer => {
        observer.error('User not authenticated');
      });
    }
  }

  getContactInfo(uid: string): Observable<any> {
    return this.firestore.collection('Users').doc(uid).get();
  }


  changePersonalData(password: string, newUsername: string, newEmail: string): Observable<void> {
    const user = this.firebaseAuth.currentUser;
    if (!user) {
      return new Observable(observer => {
        observer.error('User is not logged in.');
        observer.complete();
      });
    }

    if (newUsername === user.displayName && newEmail === user.email) {
      return new Observable(observer => {
        observer.error('New username and email are the same as the current ones.');
        observer.complete();
      });
    }

    return new Observable(observer => {
      this.isUsernameExists(newUsername).subscribe(usernameExists => {
        if (usernameExists) {
          observer.error('Username is already taken.');
          observer.complete();
        } else {
          const credential = EmailAuthProvider.credential(user.email as string, password);
          reauthenticateWithCredential(user, credential).then((response) => {
          if (newEmail !== user.email && newUsername !== user.displayName) {
              updateEmail(response.user, newEmail).then(() => {
                updateProfile(user, { displayName: newUsername }).then(() => {
                  this.firestore.collection('Users').doc(response.user.uid).update({
                    email: newEmail,
                    username: newUsername
                  }).then(() => {
                    observer.next();
                    observer.complete();
                  }).catch(error => {
                    if (error.code === 'auth/wrong-password') {
                      observer.error('Incorrect password.');
                    } else {
                      observer.error('Unknown error: ' + error.message);
                    }
                    observer.complete();
                  });
                }).catch(error => {
                  if (error.code === 'auth/wrong-password') {
                    observer.error('Incorrect password.');
                  } else {
                    observer.error('Unknown error: ' + error.message);
                  }
                  observer.complete();
                });
              }).catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                  observer.error('Email is already in use.');
                } else if (error.code === 'auth/wrong-password') {
                  observer.error('Incorrect password.');
                } else {
                  observer.error('Unknown error: ' + error.message);
                }
                observer.complete();
              });
            }
            else if (newEmail !== user.email && newUsername === user.displayName) {
              updateEmail(response.user, newEmail).then(() => {
                this.firestore.collection('Users').doc(response.user.uid).update({
                  email: newEmail,
                }).then(() => {
                  observer.next();
                  observer.complete();});
              }).catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                  observer.error('Email is already in use.');
                } else if (error.code === 'auth/wrong-password') {
                  observer.error('Incorrect password.');
                } else {
                  observer.error('Unknown error: ' + error.message);
                }
                observer.complete();
              });
            }
            else {
              updateProfile(user, { displayName: newUsername }).then(() => {
                this.firestore.collection('Users').doc(user.uid).update({
                  username: newUsername,
                }).then(() => {
                  observer.next();
                  observer.complete();
                });
              }).catch(error => {
                if (error.code === 'auth/wrong-password') {
                  observer.error('Incorrect password.');
                } else {
                  observer.error('Unknown error: ' + error.message);
                }
                observer.complete();
              });
            }
          }).catch(error => {
            if (error.code === 'auth/invalid-credential') {
              observer.error('Incorrect password.');
            } else if (error.code === 'auth/wrong-password') {
              observer.error('Incorrect password.');
            } else {
              observer.error('Unknown error: ' + error.message);
            }
            observer.complete();
          });
        }
      });
    });
  }

  loginWithEmail(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => { });
    return from(promise);
  }

  loginWithUsername(username: string, password: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestore.collection('Users', ref => ref.where('username', '==', username)).valueChanges().subscribe(users => {
        if (users.length === 0) {
          observer.error(new Error('Invalid username'));
          observer.complete();
        } else {
          const user = users[0] as { email: string };
          const email = user.email;
          this.loginWithEmail(email, password).subscribe({
            next: () => {
              observer.next();
              observer.complete();
            },
            error: (err) => {
              observer.error(err);
              observer.complete();
            }
          });
        }
      });
    });
  }

  changeContactInfo(userData: any): Promise<void> {
    const userId = this.firebaseAuth.currentUser?.uid;
    const userDoc = this.firestore.collection('Users').doc(userId);
    return userDoc.update(userData);
  }
}
