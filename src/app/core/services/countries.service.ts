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
        return this.http.get(`${this.baseUrl}api/dashboard/countries`);
    }

    getSingleCountry(id: string): Observable<any> {
        return this.http.get(`${this.baseUrl}api/dashboard/countries/${id}`);
    }

    UpdateCountry(id: string, form: any): Observable<any> {
        return this.http.post(`${this.baseUrl}api/dashboard/countries/${id}`, form);
    }
    AddCountry(form: any): Observable<any> {
        return this.http.post(`${this.baseUrl}api/dashboard/countries`, form);
    }
    DeleteCountry(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}api/dashboard/countries/${id}`);
    }
}
