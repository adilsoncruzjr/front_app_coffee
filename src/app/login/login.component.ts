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
    // Inicializando o formulário com validações
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Verifica se o usuário já está logado ao carregar o componente
    if (localStorage.getItem('access_token')) {
      this.router.navigate(['/account']);
    }
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe(
        (response: any) => {
          console.log('Login bem-sucedido', response);

          // Verificando se a resposta contém o token e o user_id
          if (response.access_token && response.user_id) {
            // Salvando o token e user_id no localStorage
            localStorage.setItem('user_id', response.user_id);
            localStorage.setItem('access_token', response.access_token);

            // Exibe uma mensagem de sucesso
            this.snackBar.open('Login bem-sucedido!', 'Fechar', { duration: 3000 });

            // Redirecionando para a rota "account"
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
}
