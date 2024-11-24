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

  sendCheckoutData(payload: { id_user: number; id_prod_q: number[]; final_value_car: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}shopping-cart`, payload);
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}orders`, orderData);
  }

  getUserOrders(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}user-orders/${userId}`);
  }
  
  getOrderDetails(cartId: number): Observable<any> {
    console.log(`Fazendo requisição para o carrinho de ID: ${cartId}`);
    return this.http.get(`${this.apiUrl}shopping-cart/${cartId}/products`);
  }
  

  logout(): Observable<any> {
    // Obter o token do localStorage para enviar no cabeçalho de autorização
    const token = localStorage.getItem('access_token');
    return this.http.post(
      `${this.apiUrl}logout`, 
      {}, 
      { headers: { Authorization: `Bearer ${token}` } } // Enviar o token de autenticação no cabeçalho
    );
  }
  
}
