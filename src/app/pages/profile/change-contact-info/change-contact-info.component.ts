import {Component, inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
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

  contactErrorMessage: string | null = null;
  deleteDialogOpen: boolean = false;

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
        .subscribe({
          next: () => {
            if (!this.deleteDialogOpen) {
              this.contactErrorMessage = 'Contact details updated!';
            } else {
              this.contactErrorMessage = '';
            }
          },
          error: (error) => {
            this.contactErrorMessage = `Error updating contact information: ${error.message}`;
            console.error('Error updating contact information: ', error);
          }
        });
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }

  initializeForm() {
    const phoneNumberValidator = (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumberRegex = /^(\+(?:[0-9] ?){6,14}[0-9]|06(?: ?[0-9]){8,12})$/;

      if (control.value && !phoneNumberRegex.test(control.value)) {
        return { 'invalidPhoneNumber': true };
      }

      return null;
    };

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
      phoneNumber: ['', [phoneNumberValidator]]
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
    this.deleteDialogOpen = true;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        question: 'Are you sure you want to delete the contact data?'
      }
    });

    const subs= dialogRef.afterClosed().subscribe({
      next: (result: boolean) => {
        this.deleteDialogOpen = false;

        if (result) {
          this.authService.getContactInfo(this.currentUser.uid).subscribe({
            next: (userData) => {
              if (userData) {

                this.authService.deleteContactInfo(userData).subscribe({
                  next: () => {
                    this.contactForm.reset();
                    console.log('Contact data deleted successfully.');
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
