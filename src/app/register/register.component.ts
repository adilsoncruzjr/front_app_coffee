import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'; // Para mensagens de erro ou sucesso
import { Router } from '@angular/router';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
   // Definição do formulário reativo
   registerForm!: FormGroup;

   constructor(
     private fb: FormBuilder, // FormBuilder para facilitar a criação do formulário
     private apiService: ApiService, // Injetando o ApiService
     private snackBar: MatSnackBar, // Para mostrar mensagens ao usuário
     private router: Router
   ) { }
 
   ngOnInit(): void {
     // Inicializando o formulário com as validações
     this.registerForm = this.fb.group({
       name: ['', [Validators.required]], // Campo nome, obrigatório
       email: ['', [Validators.required, Validators.email]], // Campo email, obrigatório e precisa ser um email válido
       password: ['', [Validators.required, Validators.minLength(6)]], // Senha, obrigatória e com mínimo de 6 caracteres
       confirmPassword: ['', [Validators.required]] // Confirmar senha, obrigatória
     }, { 
       validators: this.passwordMatchValidator // Validação para garantir que as senhas coincidem
     });
   }
 
   // Validação customizada para verificar se as senhas coincidem
   passwordMatchValidator(group: FormGroup): any {
     const password = group.get('password')?.value;
     const confirmPassword = group.get('confirmPassword')?.value;
     return password === confirmPassword ? null : { mismatch: true };
   }
 
   // Função chamada ao enviar o formulário
   onRegister(): void {
    if (this.registerForm.valid) {
      const formData = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        password_confirmation: this.registerForm.value.confirmPassword
      };
  
      console.log('Dados enviados ao backend:', formData);
  
      this.apiService.register(formData).subscribe({
        next: (response) => {
          console.log('Cadastro realizado com sucesso:', response);
          this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', {
            duration: 3000
          });
  
          // Aguarda o sucesso para redirecionar
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Erro ao registrar usuário:', err);
          this.snackBar.open('Erro ao cadastrar. Tente novamente.', 'Fechar', {
            duration: 3000
          });
        }
      });
    } else {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', 'Fechar', {
        duration: 3000
      });
    }
  }

  onCancel(): void {
    console.log('Registro cancelado. Redirecionando para a página inicial...');
    this.registerForm.reset();  // Limpa os campos do formulário
    this.router.navigate(['']);
  }

  redirectToLogin() {
    // Exibe a mensagem de sucesso para o usuário
    alert('Registrado com sucesso!');
  
    // Aguarda 1 segundo (1000 ms) para redirecionar
    setTimeout(() => {
      // Redireciona para /login após o tempo de espera
      this.router.navigate(['']);
    }, 1000);  // Ajuste o tempo conforme necessário
  }
}
