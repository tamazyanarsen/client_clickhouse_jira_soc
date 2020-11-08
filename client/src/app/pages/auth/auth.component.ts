import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router) {
        this.form = new FormGroup({
            email: new FormControl('', Validators.email),
            name: new FormControl(''),
            password: new FormControl('')
        });
    }
    form: FormGroup;

    isRegisterMode = false;

    errorMsgs = [];

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
        this.errorMsgs = [];
        this.authService.login({ ...JSON.parse(localStorage.getItem('user')), ...this.form.value }).subscribe(answer => {
            if (answer.status === 401 || answer.status === 400) {
                this.errorMsgs.push('Нужна регистрация');
            }
            localStorage.setItem('user.auth', JSON.stringify(answer));
            localStorage.setItem('accessToken', answer.access_token);
            this.router.navigate(['/dashboard']).then();
        }, console.error);
    }

    register() {
        this.authService.register({ ...this.form.value }).subscribe(user => {
            localStorage.setItem('user', JSON.stringify(user));
            // this.form.reset();
            this.isRegisterMode = false;
        }, console.error);
    }

}
