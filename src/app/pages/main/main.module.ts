import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import {MainComponent} from "./main.component";
import { ListItemComponent } from './list-item/list-item.component';
import {
  MatCard,
  MatCardActions,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";


@NgModule({
  declarations: [
    MainComponent,
    ListItemComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    NgOptimizedImage,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardImage,
    MatButton,
    MatCardSubtitle,
    MatCardTitle,
    MatIcon,
    MatIconButton,
    MatTooltip
  ]
})
export class MainModule { }
