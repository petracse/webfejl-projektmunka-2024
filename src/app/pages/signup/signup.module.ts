import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";


@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatError,
    MatInput,
    MatLabel,
    MatFormField
  ]
})
export class SignupModule { }
