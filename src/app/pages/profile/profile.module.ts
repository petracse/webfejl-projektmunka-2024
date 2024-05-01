import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";


@NgModule({
  declarations: [
    ProfileComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatError,
    MatLabel,
    MatCard,
    MatCardContent,
    MatCardHeader
  ]
})
export class ProfileModule { }
