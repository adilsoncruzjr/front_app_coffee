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

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Router para atualizar a URL
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Recupera os produtos do Local Storage
    const savedProducts = localStorage.getItem('cartProducts');
    if (savedProducts) {
      this.products = JSON.parse(savedProducts);
      this.calculateTotal();
    }

    // Recupera os IDs dos produtos na URL
    const idParam = this.route.snapshot.queryParamMap.get('id_prod');
    if (idParam) {
      const productIds = idParam.split(',');
      this.loadProducts(productIds);
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
      (total, product) => total + parseFloat(product.value_prod),
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

    // Atualiza a URL com os IDs restantes
    this.updateRouteWithIds();

    // Recalcula o total após remoção
    this.calculateTotal();
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
}
