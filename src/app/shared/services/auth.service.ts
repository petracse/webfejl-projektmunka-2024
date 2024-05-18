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
import {forkJoin, from, ignoreElements, map, Observable, Subject, switchMap} from "rxjs";
import {
  AngularFirestore
} from "@angular/fire/compat/firestore";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth:Auth = inject(Auth);
  firestore: AngularFirestore = inject(AngularFirestore);
  clickCountChange = new Subject<string | void>();

  //currentUserSig = signal<User | null | undefined>(undefined);
  user$ = user(this.firebaseAuth);

  ensureLowerCaseFieldsInBooksCollection(): Observable<void> {
    return this.firestore.collection('Books').get().pipe(
      switchMap(snapshot => {
        const tasks: Observable<void>[] = [];
        snapshot.docs.forEach(doc => {
          const data = doc.data() as { [key: string]: any };
          if (!data['authorLowercase'] || !data['titleLowercase']) {
            const task = this.updateLowerCaseFieldsInBook(doc.id, data['author'], data['title']);
            tasks.push(task);
          }
        });
        return forkJoin(tasks).pipe(ignoreElements());
      })
    );
  }

  private updateLowerCaseFieldsInBook(docId: string, author: any, title: any): Observable<void> {
    const authorLowercase = author.toLowerCase();
    const titleLowercase = title.toLowerCase();
    return from(this.firestore.collection('Books').doc(docId).update({ 'authorLowercase': authorLowercase, 'titleLowercase': titleLowercase }));
  }

  isFavorite(bookId: string): Observable<boolean> {
    return this.firestore.collection('Favorites').doc(bookId).get()
      .pipe(
        map(doc => doc.exists)
      );
  }

  toggleFavourite(bookId: string): Observable<void> {
    const favDocRef = this.firestore.collection('Favorites').doc(bookId);
    return favDocRef.get().pipe(
      switchMap(doc => {
        if (doc.exists) {
          return favDocRef.delete();
        } else {
          return favDocRef.set({});
        }
      })
    );
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

  getBookById(bookId: string): Observable<any> {
    return this.firestore.collection('Books').doc(bookId).valueChanges();
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

  updateClickCount(bookId: string, clickCount: number) {
    if (clickCount === 0) {
      localStorage.removeItem(`clickCount_${bookId}`);
      this.clickCountChange.next(bookId);
    } else {
      localStorage.setItem(`clickCount_${bookId}`, clickCount.toString());
    }
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

  changeContactInfo(userData: any): Observable<void> {
    const userId = this.firebaseAuth.currentUser?.uid;
    const userDoc = this.firestore.collection('Users').doc(userId);

    return new Observable<void>((observer) => {
      userDoc.update(userData)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  fetchBooks(
    orderBy: 'title' | 'author',
    sortOrder: 'asc' | 'desc',
    searchFilter: string | null
  ): Observable<any[]> {
    const orderByLowercase = orderBy + "Lowercase";

    return new Observable((observer) => {
      let query = this.firestore.collection('Books', (ref) => {
        let queryRef = ref.orderBy(orderByLowercase, sortOrder);

        if (searchFilter) {
          queryRef = queryRef.where(orderByLowercase, '>=', searchFilter)
            .where(orderByLowercase, '<=', searchFilter + '\uf8ff');
        }

        return queryRef;
      });

      query.snapshotChanges().subscribe((booksSnapshot) => {
        const books = booksSnapshot.map((bookSnapshot) => {
          const id = bookSnapshot.payload.doc.id;
          const data = bookSnapshot.payload.doc.data() as { [key: string]: any }; // Ensure data is typed as an object
          return { id, ...data };
        });

        observer.next(books);
        observer.complete();
      });
    });
  }


  paginateBooks(
    books: any[],
    page: number,
    pageSize: number = 20
  ): { books: any[], totalPages: number } {
    const totalBooks = books.length;
    const totalPages = Math.ceil(totalBooks / pageSize);
    const startAt = page * pageSize;
    const paginatedBooks = books.slice(startAt, startAt + pageSize);

    return { books: paginatedBooks, totalPages };
  }

  getBooks(
    page: number,
    searchFilter: string | null = "",
    orderBy: 'title' | 'author' = 'title',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Observable<any> {
    const pageSize = 20;
    const searchFilterLowercase = searchFilter === "" ? null : searchFilter?.toLowerCase();


    return new Observable((observer) => {
      forkJoin([
        this.fetchBooks('title', sortOrder, searchFilterLowercase!),
        this.fetchBooks('author', sortOrder, searchFilterLowercase!)
      ]).subscribe(([titleBooks, authorBooks]) => {
        const combinedBooks = [...new Map([...titleBooks, ...authorBooks].map(book => [book.id, book])).values()];

        const paginatedResults = this.paginateBooks(combinedBooks, page, pageSize);

        observer.next(paginatedResults);
        observer.complete();
      });
    });
  }

}
