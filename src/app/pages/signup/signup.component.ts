import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = new FormGroup<any>({});
  signupErrorMessage: string | null = null;
  authService = inject(AuthService);
  router = inject(Router);
  formBuilder: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: [''],
      username: [''],
      password: ['']
    });
  }

  onSubmit(): void {
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
