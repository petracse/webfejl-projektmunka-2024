import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-personal-data',
  templateUrl: './change-personal-data.component.html',
  styleUrl: './change-personal-data.component.scss'
})
export class ChangePersonalDataComponent implements OnInit{
  personalDataForm: FormGroup = new FormGroup({});
  personalDataErrorMessage: string | null = null;
  authService = inject(AuthService);
  router = inject(Router);
  formBuilder: FormBuilder = inject(FormBuilder);

  ngOnInit() {
    this.personalDataForm = this.formBuilder.group({
      email: [this.authService.firebaseAuth.currentUser!.email, [Validators.required, Validators.email]],
      username: [this.authService.firebaseAuth.currentUser!.displayName, [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.personalDataForm.invalid) {
      return;
    }
    const rawForm = this.personalDataForm.getRawValue();
    this.authService.changePersonalData(rawForm.password, rawForm.username, rawForm.email).
    subscribe({
      next: () => {
        this.personalDataForm.reset();
        this.personalDataErrorMessage = "Account information change was successful!";
        this.router.navigateByUrl("/profile");
      },
      error: (err) => {
        this.personalDataErrorMessage = err;
      }
    });
  }
}
