import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    baseUrl: string = 'https://dev-api.mentholatumarabia.com/';

    constructor(private http: HttpClient) {}

    getContact(): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get(`${this.baseUrl}api/dashboard/contact`, { headers });
    }
}
