import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
  
  userData: any = {
    name: '',
    cpf: '',
    email: '',
    contact_phone: '',
    orders: [],
  };
  initialData: any = {}; // Para restaurar caso cancele as alterações

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const userId = '1'; // Substitua pelo ID correto
    this.apiService.getUserData(userId).subscribe({
      next: (response) => {
        this.userData = {
          name: response.user.name,
          cpf: response.user.cpf,
          email: response.user.email,
          contact_phone: response.user.contact_phone,
          orders: JSON.parse(response.user.orders_id), // Converte string JSON para array
        };
        this.initialData = { ...this.userData };
      },
      error: (err) => {
        console.error('Erro ao carregar os dados do usuário', err);
      },
    });
  }

  saveChanges(): void {
    const userId = '2'; // ID fixo para o exemplo
    this.apiService.updateUser(userId, this.userData).subscribe({
      next: () => {
        alert('Dados salvos com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao salvar os dados do usuário', err);
        alert('Erro ao salvar os dados.');
      },
    });
  }

  cancelChanges(): void {
    // Restaura os dados iniciais
    this.userData = { ...this.initialData };
    this.router.navigate(['/catalog']);
  }
}
