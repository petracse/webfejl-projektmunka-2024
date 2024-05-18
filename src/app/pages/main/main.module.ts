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
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FormsModule} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";


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
    MatTooltip,
    MatGridTile,
    MatGridList,
    FormsModule,
    MatFormField,
    MatInput
  ]
})
export class MainModule { }
