import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() {
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // req.headers.set('Authorization', localStorage.getItem('accessToken'));
        const authReq = req.clone({
            // headers: req.headers.set('Session', '123456789').set('Access-Control-Allow-Origin', '*'),
            // headers: req.headers.set('Authorization', localStorage.getItem('accessToken'))
        });

        return next.handle(authReq).pipe(
            tap(
                (event) => {
                    if (event instanceof HttpResponse)
                        console.log('Server response');
                },
                (err) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status == 401)
                            console.log('Unauthorized');
                    }
                }
            )
        )
    }
}
