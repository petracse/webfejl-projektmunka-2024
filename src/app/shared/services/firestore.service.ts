import { Injectable } from '@angular/core';
import { AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  books: any[];

  constructor(private firestore: AngularFirestore) { }
  uploadBooks(books: any[]): void {
    books.forEach(book => {
      this.firestore.collection('Books').add(book)
        .then(docRef => {
          console.log(`Könyv hozzáadva az azonosítóval: ${docRef.id}`);
        })
        .catch(error => {
          console.error('Hiba történt a könyv hozzáadása közben:', error);
        });
    });
  }

  loadBooks(): void {
    this.firestore.collection('Books').valueChanges().subscribe(books => {
      this.books = books;
    });
  }


}
