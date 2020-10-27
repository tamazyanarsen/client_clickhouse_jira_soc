import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      login: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit() {
  }

}
