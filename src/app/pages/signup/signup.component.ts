import {Component, inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({});
  signupErrorMessage: string | null = null;
  authService = inject(AuthService);
  router = inject(Router);
  formBuilder: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordAgain: ['', [Validators.required, this.passwordMatchValidator()]]
    });
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.signupForm.get('password')?.value;
      const passwordAgain = control.value;
      return password === passwordAgain ? null : { passwordMismatch: true };
    };
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }
    const rawForm = this.signupForm.getRawValue();
    this.authService.register(rawForm.email, rawForm.username, rawForm.password).
    subscribe({
      next: () => {
        this.router.navigateByUrl("/")
      },
      error: (err) => {
        this.signupErrorMessage = err.code;
      }
    });
  }
}
