import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup = new FormGroup<any>({});
  loginErrorMessage: string | null = null;
  router = inject(Router);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['']
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
