import {Component, DoCheck, inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-personal-data',
  templateUrl: './change-personal-data.component.html',
  styleUrl: './change-personal-data.component.scss'
})
export class ChangePersonalDataComponent implements OnInit {
  personalDataForm: FormGroup = new FormGroup({});
  personalDataErrorMessage: string | null = null;
  authService = inject(AuthService);
  router = inject(Router);
  formBuilder: FormBuilder = inject(FormBuilder);
  currentUser: any;

  initializeForm() {
    this.personalDataForm = this.formBuilder.group({
      email: [this.currentUser.email || '', [Validators.required, Validators.email]],
      username: [this.currentUser.displayName || '', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') as string);
    this.initializeForm();
  }

  onSubmit() {
    if (this.personalDataForm.invalid) {
      return;
    }
    const rawForm = this.personalDataForm.getRawValue();
    this.authService.changePersonalData(rawForm.password, rawForm.username, rawForm.email).
    subscribe({
      next: () => {
        this.personalDataErrorMessage = "Account information change was successful!";
        this.authService.user$.subscribe(user => {
          localStorage.setItem('user', JSON.stringify(user));
        });
        this.router.navigateByUrl("/profile");
      },
      error: (err) => {
        this.personalDataErrorMessage = err;
      }
    });
  }

}
