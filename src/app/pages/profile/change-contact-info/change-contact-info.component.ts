import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-change-contact-info',
  templateUrl: './change-contact-info.component.html',
  styleUrl: './change-contact-info.component.scss'
})
export class ChangeContactInfoComponent implements OnInit{
  formBuilder: FormBuilder = inject(FormBuilder);
  contactForm: FormGroup = new FormGroup({});
  currentUser: any;
  dialog: MatDialog = inject(MatDialog);
  firestore: AngularFirestore = inject(AngularFirestore);

  onSubmit() {

  }

  initializeForm() {
    this.contactForm = this.formBuilder.group({
      nameGroup: this.formBuilder.group({
        firstname: [''],
        lastname: [''],
      }, {
        validators: this.groupValidator
      }),
      addressGroup: this.formBuilder.group({
        postalCode: [''],
        city: [''],
        addressLine: [''],
      }, {
        validators: this.groupValidator
      }),
      phoneNumber: [''],
    });
  }


  groupValidator(group: FormGroup): { [key: string]: any } | null {
    let isAnyFieldNotEmpty = false;

    Object.keys(group.controls).forEach(key => {
      const control = group.get(key);
      if (control instanceof FormControl && control.value !== '') {
        isAnyFieldNotEmpty = true;
      }
    });

    Object.keys(group.controls).forEach(key => {
      const control = group.get(key);
      if (control instanceof FormControl) {
        if (isAnyFieldNotEmpty) {
          control.setValidators(Validators.required);
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity({ onlySelf: true });

      }
    });

    return null;
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') as string);
    this.initializeForm();
    console.log(this.currentUser.uid);
    this.firestore.collection('Users').doc(this.currentUser.uid).get().subscribe((doc) => {
      if (doc.exists) {
        const userData: any = doc.data();
        const nameGroup = this.contactForm.get('nameGroup');
        const addressGroup = this.contactForm.get('addressGroup');

        if (nameGroup && addressGroup) {
          nameGroup.patchValue({
            firstname: userData?.name?.firstname || '',
            lastname: userData?.name?.lastname || '',
          });
          addressGroup.patchValue({
            postalCode: userData?.address?.postalCode || '',
            city: userData?.address?.city || '',
            addressLine: userData?.address?.addressLine || '',
          });
        }
        this.contactForm.patchValue({
          phoneNumber: userData?.phoneNumber || '',
        });
      } else {
        console.log('Nincs ilyen dokumentum.');
      }
    });
  }


  deleteContactData() {/*
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: 'Are you sure you want to delete the contact data?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Itt hívd meg a törlési műveletet
      }
    });*/
  }
}
