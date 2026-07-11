import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    baseUrl: string = 'https://dev-api.mentholatumarabia.com/';

    constructor(private http: HttpClient) {}

    getCategories(): Observable<any> {
        return this.http.get(`${this.baseUrl}api/dashboard/categories`);
    }

    getSingleCategory(id: string): Observable<any> {
        return this.http.get(`${this.baseUrl}api/dashboard/categories/${id}`);
    }

    UpdateCategory(id: string, form: any): Observable<any> {
        return this.http.post(`${this.baseUrl}api/dashboard/categories/${id}`, form);
    }
    AddCategory(form: any): Observable<any> {
        return this.http.post(`${this.baseUrl}api/dashboard/categories`, form);
    }
    DeleteCategory(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}api/dashboard/categories/${id}`);
    }
}
