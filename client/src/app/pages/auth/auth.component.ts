import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  form: FormGroup;

  constructor(private authService: AuthService) {
    this.form = new FormGroup({
      login: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit() {
  }

  submit() {
    this.authService.register({ ...this.form.value, email: 'test@test.com' }).subscribe(console.log);
  }

}
