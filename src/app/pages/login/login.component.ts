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

    // Ellenőrizzük, hogy az input email formátumú-e
    if (this.isValidEmail(usernameOrEmail)) {
      console.log("email")
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
      console.log("username")
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
    // Egyszerű regex ellenőrzés email formátumra
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


}
