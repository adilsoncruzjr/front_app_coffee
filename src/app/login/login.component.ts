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

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

    if (localStorage.getItem('access_token')) {
      this.router.navigate(['/account']);
    }
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe(
        (response: any) => {
          console.log('Login bem-sucedido', response);

          if (response.access_token && response.user_id) {

            localStorage.setItem('user_id', response.user_id);
            localStorage.setItem('access_token', response.access_token);
            this.snackBar.open('Login bem-sucedido!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/account']);

          } else {
            this.snackBar.open('Erro ao obter dados do usuário', 'Fechar', { duration: 3000 });
          }
        },
        error => {
          console.error('Erro no login', error);
          this.snackBar.open('Credenciais inválidas. Tente novamente.', 'Fechar', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', 'Fechar', { duration: 3000 });
    }
  }

  onRegister(): void {
    console.log('Login cancelado. Redirecionando para o registro...');
    this.router.navigate(['/register']);
  }

  onRecoverPassword(): void {
    this.router.navigate(['/recover']);
  }

}
