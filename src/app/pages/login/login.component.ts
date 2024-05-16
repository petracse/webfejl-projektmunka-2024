import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup = new FormGroup({});
  loginErrorMessage: string | null = null;
  router = inject(Router);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      usernameOrEmail: ['',[Validators.required]],
      password: ['',[Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const rawForm = this.loginForm.getRawValue();
    const usernameOrEmail = rawForm.usernameOrEmail.trim(); // Eltávolítjuk a felesleges whitespace karaktereket

    if (this.isValidEmail(usernameOrEmail)) {
      this.authService.loginWithEmail(usernameOrEmail, rawForm.password)
        .subscribe({
          next: (succ) => {
            this.router.navigateByUrl("/");
          },
          error: (err) => {
            this.loginErrorMessage = err.code;
          }
        });
    } else {
      this.authService.loginWithUsername(usernameOrEmail, rawForm.password)
        .subscribe({
          next: (succ) => {
            this.router.navigateByUrl("/");
          },
          error: (err) => {
            this.loginErrorMessage = err.code;
          }
        });
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


}
