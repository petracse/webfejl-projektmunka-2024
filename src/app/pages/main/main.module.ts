import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import {MainComponent} from "./main.component";
import { ListItemComponent } from './list-item/list-item.component';


@NgModule({
  declarations: [
    MainComponent,
    ListItemComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    NgOptimizedImage
  ]
})
export class MainModule { }
