import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BlogsService {
    baseUrl: string = 'https://dev-api.mentholatumarabia.com/';

    constructor(private http: HttpClient) {}

    getBlogs(): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get(`${this.baseUrl}api/dashboard/blogs`, { headers });
    }

    getSingleBlog(blogId: string): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get(`${this.baseUrl}api/dashboard/blogs/${blogId}`, { headers });
    }

    createBlog(form: FormData): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.post(`${this.baseUrl}api/dashboard/blogs`, form, { headers });
    }

    updateBlog(form: any, id: string): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.post(`${this.baseUrl}api/dashboard/blogs/${id}`, form, { headers });
    }

    deleteBlog(id: string): Observable<any> {
        const token = localStorage.getItem('dbToken');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.delete(`${this.baseUrl}api/dashboard/blogs/${id}`, { headers });
    }
}
