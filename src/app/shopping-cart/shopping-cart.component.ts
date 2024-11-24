import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit {
  products: any[] = []; // Lista de produtos no carrinho
  totalPrice: number = 0; // Total calculado
  quantity: number = 1; // Quantidade padrão

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Router para atualizar a URL
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Recupera os produtos salvos no Local Storage
    const savedProducts = localStorage.getItem('cartProducts');
    if (savedProducts) {
      this.products = JSON.parse(savedProducts);
      this.calculateTotal();
    } else {
      console.log('Nenhum produto no carrinho.');
    }
  }

  // Carrega os produtos usando os IDs recebidos
  loadProducts(ids: string[]): void {
    ids.forEach((id) => {
      if (!this.products.some((product) => product.id_prod === id)) {
        this.apiService.getProduct(id).subscribe({
          next: (response) => {
            if (response.product) {
              this.products.push(response.product);
              this.saveProducts();
              this.calculateTotal();
            }
          },
          error: (err) => {
            console.error('Erro ao carregar produto:', err);
          }
        });
      }
    });
  }

  // Calcula o total do carrinho
  calculateTotal(): void {
    this.totalPrice = this.products.reduce(
      (total, product) => total + (parseFloat(product.value_prod) * product.quantity),
      0
    );
  }

  // Salva os produtos no Local Storage
  saveProducts(): void {
    localStorage.setItem('cartProducts', JSON.stringify(this.products));
  }

  // Função para remover o produto
  removeProduct(productId: string): void {
    // Filtra o produto removido
    this.products = this.products.filter((product) => product.id_prod !== productId);
    
    // Atualiza o Local Storage com a nova lista
    this.saveProducts();

    // Recalcula o total após remoção
    this.calculateTotal();
  }

  // Função para criar o carrinho no banco de dados
  createCart(): void {
    const userId = localStorage.getItem('user_id'); // Obtém o id do usuário real do LocalStorage
    
    if (!userId) {
      console.error('Usuário não encontrado no LocalStorage.');
      alert('Usuário não encontrado. Por favor, faça o login.');
      return;
    }
  
    // Converte o userId para número, pois o tipo esperado é número
    const userIdNumber = Number(userId); 
  
    if (isNaN(userIdNumber)) {
      console.error('ID do usuário inválido.');
      alert('ID do usuário é inválido.');
      return;
    }
  
    // Cria a lista de IDs dos produtos
    const productIds = this.products.map(product => product.id_prod);
    
    // Cria o payload para a API
    const payload = {
      id_user: userIdNumber, // Agora o id_user é um número
      id_prod_q: productIds,
      final_value_car: this.totalPrice
    };
    
    // Envia os dados para a API para criar o carrinho
    this.apiService.sendCheckoutData(payload).subscribe({
      next: (response) => {
        // A resposta do backend contém o id e id_user do carrinho
        console.log('Carrinho criado com sucesso:', response);
  
        // Pegue o id da resposta (id do carrinho) e o id_user
        const orderId = response.data.id;
        const orderUserId = response.data.id_user;
  
        // Armazene o id do carrinho e o id_user para uso futuro
        localStorage.setItem('idCar', orderId.toString());
        localStorage.setItem('idUser', orderUserId.toString());
  
        // Limpa o Local Storage do carrinho de compras
        localStorage.removeItem('cartProducts');
  
        // Chama a criação da ordem após o carrinho ser criado
        this.createOrder(orderId);
      },
      error: (err) => {
        console.error('Erro ao criar o carrinho:', err);
        alert('Houve um erro ao criar o carrinho. Tente novamente mais tarde.');
      }
    });
  }
  

  // Função para criar a ordem no banco de dados
  createOrder(cartId: number): void {
    const userId = localStorage.getItem('idUser'); // Obtém o id do usuário do LocalStorage
    const idCar = cartId; // O id do carrinho que foi retornado da criação do carrinho

    // Cria a lista de IDs dos produtos
    const productIds = this.products.map(product => product.id_prod);

    // Cria o payload para a API da ordem
    const orderData = {
      
      final_value: this.totalPrice.toFixed(2), // Valor final do carrinho
      id_car: idCar, // ID do carrinho
      id_user: userId, // ID do usuário
      id_prod: productIds, // IDs dos produtos
      status: "ok" // Status da ordem
    };

    console.log('Enviando dados para criar a ordem:', orderData);

    // Envia os dados para a API (rota: /api/orders)
    this.apiService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Ordem criada com sucesso:', response);

        // Limpa o Local Storage
        localStorage.removeItem('cartProducts');

        // Redireciona para a página de vendas após a criação da ordem
        this.router.navigate(['/sale']);
      },
      error: (err) => {
        console.error('Erro ao criar a ordem:', err);
        alert('Houve um erro ao criar sua ordem. Tente novamente mais tarde.');
      }
    });
  }

  // Função principal que chama as funções acima para concluir o checkout
  proceedToCheckout(): void {
    // Cria o carrinho no banco de dados
    this.createCart();

    // Não é necessário redirecionar imediatamente, porque o redirecionamento ocorre após a criação da ordem.
  }

  // Função para aumentar a quantidade
  increaseQuantity(product: any): void {
    product.quantity += 1;
    this.calculateTotal();
    this.saveProducts();
  }

  // Função para diminuir a quantidade
  decreaseQuantity(product: any): void {
    if (product.quantity > 1) {
      product.quantity -= 1;
    }
    this.calculateTotal();
    this.saveProducts();
  }

  // Atualiza o total do carrinho
  updateTotalPrice(): void {
    this.totalPrice = this.products.reduce((total, product) => {
      return total + (parseFloat(product.value_prod) * product.quantity);
    }, 0);
  }

  // Atualiza a URL com os IDs dos produtos restantes
  updateRouteWithIds(): void {
    const remainingIds = this.products.map((product) => product.id_prod).join(',');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id_prod: remainingIds }, // Atualiza a URL com os IDs restantes
      queryParamsHandling: 'merge', // Para manter outros parâmetros na URL
    });
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  // Método para redirecionar para a página de catálogo
  navigateToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}
