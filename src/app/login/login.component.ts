import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe(
        response => {
          console.log('Login bem-sucedido', response);

          // Salvar o user_id e o token no localStorage
          localStorage.setItem('user_id', response.user_id);
          localStorage.setItem('access_token', response.access_token);

          this.router.navigate(['/account']);  // Redireciona para a rota "account"
        },
        error => {
          console.error('Erro no login', error);
        }
      );
    }
  }

  onRegister(): void {
    console.log('Login cancelado. Redirecionando para o lregister...');
    this.router.navigate(['/register']);
  }
}
