import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../../../shared/confirmation-dialog/confirmation-dialog.component";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-change-contact-info',
  templateUrl: './change-contact-info.component.html',
  styleUrl: './change-contact-info.component.scss'
})
export class ChangeContactInfoComponent implements OnInit{
  formBuilder: FormBuilder = inject(FormBuilder);
  contactForm: FormGroup = new FormGroup({});
  currentUser: any;
  authService: AuthService = inject(AuthService);
  dialog: MatDialog = inject(MatDialog);
  deletionInProgress: boolean = false;


  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.getRawValue();
      const userData = {
        name: {
          firstname: formData.nameGroup.firstname,
          lastname: formData.nameGroup.lastname
        },
        address: {
          postalCode: formData.addressGroup.postalCode,
          city: formData.addressGroup.city,
          addressLine: formData.addressGroup.addressLine
        },
        phoneNumber: formData.phoneNumber
      };

      this.authService.changeContactInfo(userData)
        .then(() => {
          console.log('Contact information successfully updated!');
        })
        .catch((error) => {
          console.error('Error updating contact information: ', error);
        });
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
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
    console.log(this.currentUser.uid);
    this.initializeForm();
    this.authService.getContactInfo(this.currentUser.uid as string).subscribe({
      next: (userDataSnapshot: any) => {
        const userData = userDataSnapshot.data();
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
      },
      error: (error: any) => {
        console.error('Error fetching contact information: ', error);
      }
    });
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: 'Are you sure you want to delete the contact data?'
    });

    const subs= dialogRef.afterClosed().subscribe({
      next: (result: boolean) => {
        if (result) {
          this.authService.getContactInfo(this.currentUser.uid).subscribe({
            next: (userData) => {
              if (userData) {
                //console.log(userData);
                this.authService.deleteContactInfo(userData).subscribe({
                  next: () => {
                    this.contactForm.reset();
                    console.log('Contact data deleted successfully.');
                    // Egyéb teendők, pl. frissítés vagy visszajelzés a felhasználónak
                  },
                  error: (error) => {
                    console.error('Error deleting contact data:', error);
                  }
                });
              } else {
                console.error('User data not found');
              }
            },
            error: (error) => {
              // Hibakezelés
              console.error('Error getting contact data:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Confirmation dialog error:', error);
      }
    });
  }

}
