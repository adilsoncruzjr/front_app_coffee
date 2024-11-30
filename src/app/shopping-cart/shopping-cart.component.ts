import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit {
  products: any[] = [];
  totalPrice: number = 0;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    const savedProducts = localStorage.getItem('cartProducts');
    if (savedProducts) {
      this.products = JSON.parse(savedProducts);
      this.calculateTotal();
    } else {
      console.log('Nenhum produto no carrinho.');
    }
  }

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

  calculateTotal(): void {
    this.totalPrice = this.products.reduce(
      (total, product) => total + (parseFloat(product.value_prod) * product.quantity),
      0
    );
  }

  saveProducts(): void {
    localStorage.setItem('cartProducts', JSON.stringify(this.products));
  }


  removeProduct(productId: string): void {

    this.products = this.products.filter((product) => product.id_prod !== productId);
    this.saveProducts();
    this.calculateTotal();
  }

  createCart(): void {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      console.error('Usuário não encontrado no LocalStorage.');
      alert('Usuário não encontrado. Por favor, faça o login.');
      return;
    }

    const userIdNumber = Number(userId);

    if (isNaN(userIdNumber)) {
      console.error('ID do usuário inválido.');
      alert('ID do usuário é inválido.');
      return;
    }

    const productIds = this.products.map(product => product.id_prod);
    const payload = {
      id_user: userIdNumber,
      id_prod_q: productIds,
      final_value_car: this.totalPrice
    };


    this.apiService.sendCheckoutData(payload).subscribe({
      next: (response) => {
        console.log('Carrinho criado com sucesso:', response);
        const orderId = response.data.id;
        const orderUserId = response.data.id_user;

        localStorage.setItem('idCar', orderId.toString());
        localStorage.setItem('idUser', orderUserId.toString());
        localStorage.removeItem('cartProducts');

        this.createOrder(orderId);
      },
      error: (err) => {
        console.error('Erro ao criar o carrinho:', err);
        alert('Houve um erro ao criar o carrinho. Tente novamente mais tarde.');
      }
    });
  }

  createOrder(cartId: number): void {
    const userId = localStorage.getItem('idUser');
    const idCar = cartId;
    const productIds = this.products.map(product => product.id_prod);
    const orderData = {

      final_value: this.totalPrice.toFixed(2),
      id_car: idCar,
      id_user: userId,
      id_prod: productIds,
      status: "ok"
    };

    console.log('Enviando dados para criar a ordem:', orderData);
    this.apiService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Ordem criada com sucesso:', response);
        localStorage.removeItem('cartProducts');
        this.router.navigate(['/sale']);
      },
      error: (err) => {
        console.error('Erro ao criar a ordem:', err);
        alert('Houve um erro ao criar sua ordem. Tente novamente mais tarde.');
      }
    });
  }

  proceedToCheckout(): void {
    this.createCart();
  }

  increaseQuantity(product: any): void {
    product.quantity += 1;
    this.calculateTotal();
    this.saveProducts();
  }

  decreaseQuantity(product: any): void {
    if (product.quantity > 1) {
      product.quantity -= 1;
    }
    this.calculateTotal();
    this.saveProducts();
  }

  updateTotalPrice(): void {
    this.totalPrice = this.products.reduce((total, product) => {
      return total + (parseFloat(product.value_prod) * product.quantity);
    }, 0);
  }

  updateRouteWithIds(): void {
    const remainingIds = this.products.map((product) => product.id_prod).join(',');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id_prod: remainingIds },
      queryParamsHandling: 'merge',
    });
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  navigateToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}
