import {inject, Injectable} from "@angular/core";
import {Auth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {forkJoin, from, ignoreElements, map, Observable, of, Subject, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  firebaseAuth:Auth = inject(Auth);
  firestore: AngularFirestore = inject(AngularFirestore);
  clickCountChange = new Subject<string | void>();

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

  isFavorite(bookId: string, userId: string | null): Observable<boolean> {
    if (userId === null) {
      return of(false);
    }
    return this.firestore.collection('Favorites', ref =>
      ref.where('bookId', '==', bookId).where('userId', '==', userId))
      .get()
      .pipe(
        map(snapshot => !snapshot.empty)
      );
  }

  toggleFavorite(bookId: string, userId: string | null): Observable<void> {
    const favCollectionRef = this.firestore.collection('Favorites');
    if (userId === null) {
      return of();
    }

    const query = favCollectionRef.ref.where('bookId', '==', bookId).where('userId', '==', userId);

    return from(query.get()).pipe(
      switchMap(snapshot => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0]; // We know there's only one document
          return from(doc.ref.delete());
        } else {
          return from(favCollectionRef.add({ bookId, userId }));
        }
      }),
      map(() => {
        return undefined;
      })
    );
  }

  getBookById(bookId: string): Observable<any> {
    return this.firestore.collection('Books').doc(bookId).valueChanges();
  }

  updateClickCount(bookId: string, clickCount: number) {
    if (clickCount === 0) {
      localStorage.removeItem(`clickCount_${bookId}`);
      this.clickCountChange.next(bookId);
    } else {
      localStorage.setItem(`clickCount_${bookId}`, clickCount.toString());
    }
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
