import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const token = localStorage.getItem('access_token'); // Obtendo o token do localStorage
  
  if (token) {
    // Se o token existe, a rota é acessível
    return true;
  } else {
    // Se o token não existe, redirecione para a página de login
    const router = inject(Router); // Injeta o Router para redirecionamento
    router.navigate(['/']);
    return false;
  };
};
