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
    if (this.loginForm.invalid) {
      return;
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    const rawForm = this.loginForm.getRawValue();
    this.authService.login(rawForm.email,rawForm.password)
      .subscribe({
        next: () => {
            this.router.navigateByUrl("/")
          },
        error: (err) => {
          this.loginErrorMessage = err.code;
        }
        }
      )
  }

}
