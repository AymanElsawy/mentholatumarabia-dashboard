import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReviewsService {
    baseUrl: string = 'https://dev-api.mentholatumarabia.com/';

    constructor(private http: HttpClient) {}

    getReviews(): Observable<any> {
        return this.http.get(`${this.baseUrl}api/dashboard/reviews`);
    }

    getSingleReview(id: string): Observable<any> {
        return this.http.get(`${this.baseUrl}api/dashboard/reviews/${id}`);
    }

    UpdateReviewStatus(id: string, status: boolean): Observable<any> {
        return this.http.post(`${this.baseUrl}api/dashboard/reviews/${id}/toggle-status`, { status });
    }
}
