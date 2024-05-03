import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-change-contact-info',
  templateUrl: './change-contact-info.component.html',
  styleUrl: './change-contact-info.component.scss'
})
export class ChangeContactInfoComponent implements OnInit{
  formBuilder: FormBuilder = inject(FormBuilder);
  contactForm: FormGroup = new FormGroup({});

  firestore: AngularFirestore = inject(AngularFirestore);
  onSubmit() {

  }

  initializeForm() {
    this.contactForm = this.formBuilder.group({
      firstname: [''],
      lastname: [''],
      postalCode: [''],
      city: [''],
      addressLine: [''],
      phoneNumber: [''],
    });
  }

  ngOnInit() {
    // currentUser-ből kiolvassuk az emailt
    const currentUser = JSON.parse(localStorage.getItem('user') as string);
    this.initializeForm();
    console.log(currentUser.uid);
    this.firestore.collection('Users').doc(currentUser.uid).get().subscribe((doc) => {
      if (doc.exists) {
        console.log(doc.id)
        const userData: any = doc.data();
        this.contactForm.patchValue({
          firstname: userData?.name?.firstname || '',
          lastname: userData?.name?.lastname || '',
          postalCode: userData?.address?.postalCode || '',
          city: userData?.address?.city || '',
          addressLine: userData?.address?.addressLine || '',
          phoneNumber: userData?.phoneNumber || '',
        });
      } else {
        console.log('Nincs ilyen dokumentum.');
      }
    });


  }

}
