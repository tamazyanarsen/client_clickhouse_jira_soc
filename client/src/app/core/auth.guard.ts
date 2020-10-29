import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private http: HttpClient, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        this.check();
        if (localStorage.getItem('accessToken')) {
            console.log('check accessToken', localStorage.getItem('accessToken'));
            return this.http.get<boolean>(environment.url + `/api/auth/validate/${localStorage.getItem('accessToken')}`);
        }
        return false;
    }

    async check() {
        const res: boolean = await this.http.get<boolean>(
            environment.url + `/api/auth/validate/${localStorage.getItem('accessToken')}`).toPromise();
        console.log(res);
        if (!res) {
            this.router.navigate(['/auth']);
        }
    }

}
