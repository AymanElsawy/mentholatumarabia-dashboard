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
        return this.http.get(`${this.baseUrl}api/dashboard/brands`);
    }

    getSingleBrands(id: string): Observable<any> {
        return this.http.get(`${this.baseUrl}api/dashboard/brands/${id}`);
    }

    UpdateBrand(id: string, form: any): Observable<any> {

        return this.http.post(`${this.baseUrl}api/dashboard/brands/${id}`, form);
    }
    AddBrand(form: any): Observable<any> {
        return this.http.post(`${this.baseUrl}api/dashboard/brands`, form);
    }
    DeleteBrand(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}api/dashboard/brands/${id}`);
    }
}
