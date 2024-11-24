import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  userData: any = {
    name: '',
    cpf: '',
    email: '',
    contact_phone: '',
    orders: [],
  };
  userId: number | null = null;
  initialData: any = {}; // Para restaurar caso cancele as alterações

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    // Recupera o user_id do localStorage
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('Usuário não autenticado. Redirecionando para a página de login.');
      this.router.navigate(['/']);
      return;
    }

    this.userId = parseInt(userId, 10); // Define o userId corretamente

    // Carrega os dados do usuário
    this.apiService.getUserData(userId).subscribe({
      next: (response) => {
        this.userData = {
          name: response.user.name,
          cpf: response.user.cpf,
          email: response.user.email,
          contact_phone: response.user.contact_phone,
          orders: [], // As ordens serão carregadas via loadUserOrders()
        };
        
        this.initialData = { ...this.userData };
        console.log(this.userData);

        // Carregar as ordens do usuário após carregar os dados do usuário
        this.loadUserOrders();
      },
      error: (err) => {
        console.error('Erro ao carregar os dados do usuário', err);
      },
    });
  }

  saveChanges(): void {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('Erro ao salvar. Usuário não autenticado.');
      return;
    }

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

  loadUserOrders() {
    console.debug('Iniciando a carga das ordens do usuário...'); // Log de depuração para iniciar a carga
  
    if (this.userId === null) {
      console.error('User ID não está definido.');
      return;
    }
  
    console.debug(`Buscando ordens para o usuário com ID: ${this.userId}`); // Log de depuração para o ID do usuário
  
    this.apiService.getUserOrders(this.userId).subscribe({
      next: (response) => {
        console.debug('Respostas recebidas das ordens:', response); // Log de depuração para a resposta
        this.userData.orders = response.orders; // Agora as ordens são atribuídas a partir da API
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error); // Log de erro se algo der errado
      }
    });
  }

  goToOrderDetails(carId: number): void {
    this.router.navigate([`/order/${carId}`]); // Redireciona para a página de detalhes da ordem
  }

  hoverOrderId(isHovered: boolean): void {
    // Pode adicionar lógica para alterar algum estado se precisar
    if (isHovered) {
      console.log('Hovered over Order ID!');
    }
  }

  navigateHome(): void {
    this.router.navigate(['/catalog']);
  }

  logout(): void {
    this.apiService.logout().subscribe({
      next: () => {
        // Limpa o localStorage
        localStorage.removeItem('user_id');
        localStorage.removeItem('access_token');

        // Redireciona para a página de login
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erro ao realizar logout', err);

        // Mesmo que haja erro, limpa o localStorage e redireciona
        localStorage.removeItem('user_id');
        localStorage.removeItem('access_token');
        this.router.navigate(['/']);
      },
    });
  }
}
