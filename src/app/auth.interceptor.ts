// src/app/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtém o token do localStorage
    const token = localStorage.getItem('access_token');

    // Se o token existir, adiciona o cabeçalho Authorization à requisição
    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest);  // Continua o fluxo com a requisição modificada
    }

    // Se não houver token, apenas continua com a requisição sem modificar
    return next.handle(req);
  }
}
