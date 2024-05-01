import {Component, inject} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  passwordForm: FormGroup = new FormGroup({});
  passwordErrorMessage: string | null = null;
  authService = inject(AuthService);
  router = inject(Router);
  formBuilder: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPasswordAgain: ['', [Validators.required, this.passwordMatchValidator()]]
    });
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.passwordForm.get('newPassword')?.value;
      const passwordAgain = control.value;
      return password === passwordAgain ? null : { passwordMismatch: true };
    };
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      return;
    }
    const rawForm = this.passwordForm.getRawValue();
    this.authService.changePassword(rawForm.oldPassword, rawForm.newPassword).
    subscribe({
      next: () => {
        this.passwordForm.reset();
        this.passwordErrorMessage = "Password change was successful!";
        this.router.navigateByUrl("/profile");
      },
      error: (err) => {
        this.passwordErrorMessage = "Old password is incorrect.";
      }
    });
  }
}
