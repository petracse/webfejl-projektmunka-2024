import {Component, inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {CustomCurrencyPipe} from "../../shared/pipes/custom-currency.pipe";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{
  formBuilder: FormBuilder = inject(FormBuilder);
  checkoutForm: FormGroup = new FormGroup({});
  currentUser: any;
  authService: AuthService = inject(AuthService);
  dialog: MatDialog = inject(MatDialog);
  shoppingCartBooks: any[] = [];
  totalPrice: number = 0;
  router = inject(Router);
  currentCurrency: string = 'EUR';
  currencyPipe = inject(CustomCurrencyPipe);


  checkoutErrorMessage: string | null = null;
  deleteDialogOpen: boolean = false;

  onSubmit() {
    if (this.checkoutForm.valid) {
      const formData = this.checkoutForm.getRawValue();
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

    this.checkoutForm = this.formBuilder.group({
      nameGroup: this.formBuilder.group({
        firstname: ['', [Validators.required]],
        lastname: ['',[Validators.required]],
      }),
      addressGroup: this.formBuilder.group({
        postalCode: ['',[Validators.required]],
        city: ['',[Validators.required]],
        addressLine: ['',[Validators.required]],
      }),
      phoneNumber: ['', [Validators.required,phoneNumberValidator]]
    });
  }

  ngOnInit() {
    if (!history.state.shoppingCartBooks || !history.state.totalPrice || !history.state.currentCurrency) {
      this.router.navigate(['/home']);
    } else {
      this.shoppingCartBooks = history.state.shoppingCartBooks;
      this.totalPrice = history.state.totalPrice;
      this.currentCurrency = history.state.currentCurrency;
    }
    this.currentUser = JSON.parse(localStorage.getItem('user') as string);
    this.initializeForm();
    this.authService.getContactInfo(this.currentUser.uid as string).subscribe({
      next: (userDataSnapshot: any) => {
        const userData = userDataSnapshot.data();
        const nameGroup = this.checkoutForm.get('nameGroup');
        const addressGroup = this.checkoutForm.get('addressGroup');

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
        this.checkoutForm.patchValue({
          phoneNumber: userData?.phoneNumber || '',
        });
      },
      error: (error: any) => {
        console.error('Error fetching contact information: ', error);
      }
    });
  }


  saveForLater() {
    if (this.checkoutForm.valid) {
      const formData = this.checkoutForm.getRawValue();
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
              this.checkoutErrorMessage = 'Contact details saved in profile!';
            } else {
              this.checkoutErrorMessage = '';
            }
          },
          error: (error) => {
            this.checkoutErrorMessage = `Error updating contact information: ${error.message}`;
            console.error('Error updating contact information: ', error);
          }
        });
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }

  formatTotalPrice(totalPrice: number): string {
    return this.currencyPipe.transform(this.currentCurrency as string, totalPrice, 'EUR');
  }
}
