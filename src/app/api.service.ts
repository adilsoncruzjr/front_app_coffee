import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://127.0.0.1:8000/api/'; // URL base da API

  constructor(private http: HttpClient) { }
  
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}register`, userData);
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}login`, credentials);
  }

  getUserData(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}user/${userId}`);
  }
  
  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}user/${userId}`, userData);
  }

  getProducts(page: number, perPage: number = 6): Observable<any> {
    const params = { 
      page: page.toString(), 
      per_page: perPage.toString() 
    };
    return this.http.get(`${this.apiUrl}products`, { params });
  }

  getProduct(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}products/${id}`);
  }
  
}
