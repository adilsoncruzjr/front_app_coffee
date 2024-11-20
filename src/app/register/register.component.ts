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
      // Ajustando o objeto para enviar com a ordem e os nomes de campo corretos
      const formData = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        password_confirmation: this.registerForm.value.confirmPassword, // Mudando o nome para o esperado pela API
      };
  
      console.log('Dados que serão enviados:', formData);  // Verifique os dados no console
  
      this.apiService.register(formData).subscribe({
        next: (response) => {
          this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', {
            duration: 3000,
          });
        },
        error: (err) => {
          console.error('Erro no registro:', err);  // Isso ajudará a depurar
          this.snackBar.open('Erro ao cadastrar. Tente novamente.', 'Fechar', {
            duration: 3000,
          });
        }
      });
    } else {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', 'Fechar', {
        duration: 3000,
      });
    }
  }

  onCancel(): void {
    console.log('Registro cancelado. Redirecionando para o login...');
    this.router.navigate(['']);
  }
}
