import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BrandsService {
    baseUrl: string = 'https://dev-api.mentholatumarabia.com/';

    constructor(private http: HttpClient) {}

    getBrands(): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get(`${this.baseUrl}api/dashboard/brands`, { headers });
    }

    getSingleBrands(id: string): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get(`${this.baseUrl}api/dashboard/brands/${id}`, { headers });
    }

    UpdateBrand(id: string, form: any): Observable<any> {

        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.post(`${this.baseUrl}api/dashboard/brands/${id}`, form, { headers });
    }
    AddBrand(form: any): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.post(`${this.baseUrl}api/dashboard/brands`, form, { headers });
    }
    DeleteBrand(id: string): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.delete(`${this.baseUrl}api/dashboard/brands/${id}`, { headers });
    }
}
