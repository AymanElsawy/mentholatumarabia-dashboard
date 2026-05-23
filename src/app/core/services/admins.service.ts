import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminsService {
  baseUrl: string = 'https://dev-api.mentholatumarabia.com/';

  constructor(private http: HttpClient) { }




  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/dashboard/users`);
  }
  getSingleAdmin(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/dashboard/users/${id}`);
  }

  createAdmin(form: any): Observable<any> {
    return this.http.post(`${this.baseUrl}api/dashboard/users/create`, form);
  }
  updateAdmin(form: any, id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}api/dashboard/users/${id}/update`, form);
  }
  deleteAdmin(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}api/dashboard/users/${id}`);
  }
}
