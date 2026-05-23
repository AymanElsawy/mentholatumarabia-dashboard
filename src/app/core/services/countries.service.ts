import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CountriesService {
    baseUrl: string = 'https://dev-api.mentholatumarabia.com/';

    constructor(private http: HttpClient) {}

    getCountries(): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get(`${this.baseUrl}api/dashboard/countries`, { headers });
    }

    getSingleCountry(id: string): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get(`${this.baseUrl}api/dashboard/countries/${id}`, { headers });
    }

    UpdateCountry(id: string, form: any): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.post(`${this.baseUrl}api/dashboard/countries/${id}`, form, { headers });
    }
    AddCountry(form: any): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.post(`${this.baseUrl}api/dashboard/countries`, form, { headers });
    }
    DeleteCountry(id: string): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.delete(`${this.baseUrl}api/dashboard/countries/${id}`, { headers });
    }
}
