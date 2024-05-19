import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";


@NgModule({
  declarations: [
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton
  ]
})
export class CheckoutModule { }
