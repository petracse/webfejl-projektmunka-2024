import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
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
    const currentUser = JSON.parse(localStorage.getItem('user') as string);
    this.initializeForm();
    console.log(currentUser.uid);
    this.firestore.collection('Users').doc(currentUser.uid).get().subscribe((doc) => {
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


}
