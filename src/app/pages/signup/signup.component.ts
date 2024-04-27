import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  signupErrorMessage: string | null = null;
  authService = inject(AuthService);
  router = inject(Router);

  constructor(private formBuilder: FormBuilder) {
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
    })

  }
}
