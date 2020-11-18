import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) {
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // req.headers.set('Authorization', localStorage.getItem('accessToken'));
        const token = localStorage.getItem('accessToken') || '';
        const authReq = req.clone({
            // headers: req.headers.set('Session', '123456789').set('Access-Control-Allow-Origin', '*'),
            headers: req.headers.set('Authorization', token).set('Access-Control-Allow-Origin', '*'),
        });

        return next.handle(authReq).pipe(
            tap(
                (event) => {
                    if (event instanceof HttpResponse) {
                        console.log('Server response', event);
                        if (event.body.status === 401 || event.status === 401) {
                            this.router.navigate(['/auth']);
                        }
                    }
                },
                (err) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401) {
                            console.log('Unauthorized');
                        }
                    }
                }
            )
        );
    }
}
