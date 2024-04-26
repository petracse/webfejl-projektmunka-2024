import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent{

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    // FormGroup létrehozása a FormBuilder segítségével
    this.form = this.formBuilder.group({
      email: [''], // email formControl
      password: [''] // password formControl
    });
  }

  onSubmit() {
    console.log('Email:', this.form.get('email')?.value); // Null ellenőrzés
  }

}
