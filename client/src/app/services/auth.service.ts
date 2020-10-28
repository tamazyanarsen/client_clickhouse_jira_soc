import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  register(user): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    return this.httpClient.post('/api/auth/register', user, { headers });
  }
}
