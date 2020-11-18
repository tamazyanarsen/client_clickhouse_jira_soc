import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private http: HttpClient, private router: Router,
                private authService: AuthService) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return true;
        // TODO убрать заглушку
        this.check();
        if (localStorage.getItem('accessToken')) {
            console.log('check accessToken', localStorage.getItem('accessToken'));
            const res = this.http.get<boolean>(environment.url + `/api/auth/validate/${localStorage.getItem('accessToken')}`);
            res.subscribe(e => this.authService.isAuth.next(e));
            return res;
        }
        return false;
    }

    async check() {
        const res: boolean = await this.http.get<boolean>(
            environment.url + `/api/auth/validate/${localStorage.getItem('accessToken')}`).toPromise();
        console.log(res);
        if (!res) {
            this.authService.isAuth.next(false);
            this.router.navigate(['/auth']);
        }
    }

}
