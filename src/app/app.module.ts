import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { MenuComponent } from './shared/menu/menu.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatNavList} from "@angular/material/list";
import {LoginComponent} from "./pages/login/login.component";

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent
  ],
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp({
      "projectId": "webfejl-pe-2024",
      "appId": "1:546988117878:web:97ed92e63556e486c1b457",
      "storageBucket": "webfejl-pe-2024.appspot.com",
      "apiKey": "AIzaSyD30x2Xx0NY_IS0ObtZTfEOvaKVBBvFKy8",
      "authDomain": "webfejl-pe-2024.firebaseapp.com",
      "messagingSenderId": "546988117878"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    MatIconButton,
    MatIcon,
    MatNavList,
    MatListItem
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
