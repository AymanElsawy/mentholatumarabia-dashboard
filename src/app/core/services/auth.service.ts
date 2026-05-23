import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    baseUrl: string = 'https://dev-api.mentholatumarabia.com/';

    constructor(private http: HttpClient) { }
    login(form: any): Observable<any> {
        return this.http.post(`${this.baseUrl}api/dashboard/login`, form);
    }
    register(form: any): Observable<any> {
        return this.http.post(`${this.baseUrl}api/dashboard/register`, form);
    }

    sendOtp(form: any): Observable<any> {
        return this.http.post(`${this.baseUrl}api/dashboard/send-otp`, form);
    }
    resetPassword(form: any): Observable<any> {
        return this.http.post(`${this.baseUrl}api/dashboard/reset-password`, form);
    }
    logout(): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.post(`${this.baseUrl}api/dashboard/logout`, {}, { headers });
    }
}
