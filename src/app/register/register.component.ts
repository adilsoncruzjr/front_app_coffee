import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup): any {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

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
    this.registerForm.reset();
    this.router.navigate(['']);
  }

  redirectToLogin() {

    alert('Registrado com sucesso!');


    setTimeout(() => {

      this.router.navigate(['']);
    }, 1000);
  }
}
