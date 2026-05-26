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
        return this.http.get(`${this.baseUrl}api/dashboard/blogs`);
    }

    getSingleBlog(blogId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}api/dashboard/blogs/${blogId}`);
    }

    createBlog(form: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}api/dashboard/blogs`, form);
    }

    updateBlog(form: any, id: string): Observable<any> {
        return this.http.post(`${this.baseUrl}api/dashboard/blogs/${id}`, form);
    }

    deleteBlog(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}api/dashboard/blogs/${id}`);
    }
}
