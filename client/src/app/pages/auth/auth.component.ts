import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
    form: FormGroup;

    constructor(private authService: AuthService, private router: Router) {
        this.form = new FormGroup({
            email: new FormControl(''),
            name: new FormControl(''),
            password: new FormControl('')
        });
    }

    isRegisterMode = false;

    ngOnInit() {
    }

    submit() {
        if (this.isRegisterMode) {
            this.register();
        } else {
            this.login();
        }
    }

    login() {
        //   //  {accessToken, expiresIn, userId, status}

        this.authService.login({ ...JSON.parse(localStorage.getItem('user')), ...this.form.value }).subscribe(answer => {
            localStorage.setItem('user.auth', JSON.stringify(answer));
            localStorage.setItem('accessToken', answer.access_token);
            this.router.navigate(['/dashboard']).then();
        });
    }

    register() {
        this.authService.register({ ...this.form.value }).subscribe(user => {
            localStorage.setItem('user', JSON.stringify(user));
            this.isRegisterMode = false;
        });
    }

}
