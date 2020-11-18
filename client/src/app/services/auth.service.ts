import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    isAuth: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    login(user): Observable<any> {
        const headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json');
        return this.httpClient.post(environment.url + '/api/auth/login', user, { headers });
    }

    register(user): Observable<any> {
        const headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json');
        return this.httpClient.post(environment.url + '/api/auth/register', user, { headers });
    }

    logout() {
        localStorage.removeItem('accessToken');
        this.router.navigate(['/auth']);
    }
}
