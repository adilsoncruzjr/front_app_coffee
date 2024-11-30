import { Component, OnInit } from '@angular/core';
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
    address: '',
    orders: [],
  };
  userId: number | null = null;
  initialData: any = {};
  cpfError: string = '';
  phoneError: string = '';

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('Usuário não autenticado. Redirecionando para a página de login.');
      this.router.navigate(['/']);
      return;
    }

    this.userId = parseInt(userId, 10);

    this.apiService.getUserData(userId).subscribe({
      next: (response) => {
        this.userData = {
          name: response.user.name,
          cpf: response.user.cpf,
          email: response.user.email,
          contact_phone: response.user.contact_phone,
          address: response.user.address,
          orders: [],
        };

        this.initialData = { ...this.userData };
        console.log(this.userData);

        this.loadUserOrders();
      },
      error: (err) => {
        console.error('Erro ao carregar os dados do usuário', err);
      },
    });
  }

  validateCpf(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) {
      return false;
    }

    let sum = 0;
    let remainder: number;

    if (cpf === '00000000000' || cpf === '11111111111' || cpf === '22222222222' || cpf === '33333333333' ||
      cpf === '44444444444' || cpf === '55555555555' || cpf === '66666666666' || cpf === '77777777777' ||
      cpf === '88888888888' || cpf === '99999999999') {
      return false;
    }

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.charAt(i - 1), 10) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.charAt(9), 10)) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.charAt(i - 1), 10) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.charAt(10), 10)) {
      return false;
    }

    return true;
  }

  onCpfChange(): void {
    const cpf = this.userData.cpf;
    if (this.validateCpf(cpf)) {
      this.cpfError = '';
      this.userData.cpf = cpf.replace(/\D/g, '');
    } else {
      this.cpfError = 'CPF inválido. Por favor, insira um CPF válido.';
    }
  }

  validatePhone(phone: string): boolean {
    phone = phone.replace(/\D/g, '');

    if (phone.length !== 11) {
      return false;
    }

    const validDdd = [
      '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '21', '22', '24',
      '27', '28',
      '31', '32', '33', '34', '35', '36', '37', '38',
      '41', '42', '43', '44', '45', '46', '47', '48', '49',
      '51', '52', '53', '54', '55',
      '61',
      '62', '63', '64', '65', '66', '67', '68', '69',
      '71', '72', '73', '74', '75', '76', '77', '78', '79',
      '81', '82', '83', '84', '85', '86', '87', '88', '89',
      '91', '92', '93', '94', '95', '96', '97', '98', '99'
    ];

    const ddd = phone.substring(0, 2);
    if (!validDdd.includes(ddd)) {
      return false;
    }

    if (phone.charAt(2) !== '9') {
      return false;
    }

    return true;
  }

  onPhoneChange(): void {
    const phone = this.userData.contact_phone;
    if (this.validatePhone(phone)) {
      this.phoneError = '';
      this.userData.contact_phone = phone.replace(/\D/g, '');
    } else {
      this.phoneError = 'Número de celular inválido. Por favor, insira um número válido.';
    }
  }

  saveChanges(): void {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('Erro ao salvar. Usuário não autenticado.');
      return;
    }

    if (this.cpfError) {
      alert(this.cpfError);
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
    this.userData = { ...this.initialData };
    this.router.navigate(['/catalog']);
  }

  loadUserOrders() {
    console.debug('Iniciando a carga das ordens do usuário...');

    if (this.userId === null) {
      console.error('User ID não está definido.');
      return;
    }

    console.debug(`Buscando ordens para o usuário com ID: ${this.userId}`);

    this.apiService.getUserOrders(this.userId).subscribe({
      next: (response) => {
        console.debug('Respostas recebidas das ordens:', response);
        this.userData.orders = response.orders;
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
      }
    });
  }


  goToOrderDetails(carId: number): void {
    this.router.navigate([`/order/${carId}`]);
  }

  hoverOrderId(isHovered: boolean): void {
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
        localStorage.removeItem('user_id');
        localStorage.removeItem('access_token');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erro ao realizar logout', err);
        localStorage.removeItem('user_id');
        localStorage.removeItem('access_token');
        this.router.navigate(['/']);
      },
    });
  }
}
