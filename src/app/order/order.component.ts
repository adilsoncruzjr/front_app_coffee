import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit{

  cartId: number = 0;  // Inicializa com 0
  finalValue: string = '';  // Inicializa com uma string vazia
  products: any[] = [];  // Inicializa com um array vazio

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Obtém o cartId da URL e chama a função para buscar os detalhes
    this.route.params.subscribe(params => {
      this.cartId = +params['id_car'];  // Atribui o ID do carrinho da URL
      console.log('ID do carrinho:', this.cartId);
      this.getOrderDetails();  // Chama a função para obter os detalhes do pedido
    });
  }

  // Função para pegar os detalhes do pedido (id_prod_q)
  getOrderDetails(): void {
    this.apiService.getOrderDetails(this.cartId).subscribe(
      (response: any) => {
        console.log('Detalhes do pedido:', response);
        this.finalValue = response.final_value_car;  // Atribui o valor total do pedido
        this.getProductsDetails(response.id_prod_q);  // Passa a lista de id_prod para obter os detalhes dos produtos
      },
      (error) => {
        console.error('Erro ao buscar os detalhes do pedido:', error);
      }
    );
  }

  // Função para pegar os detalhes dos produtos
  getProductsDetails(productIds: string[]): void {
    productIds.forEach(id_prod => {
      this.apiService.getProduct(id_prod).subscribe(
        (response: any) => {
          console.log('Produto:', response.product);
          this.products.push(response.product);  // Adiciona o produto ao array de produtos
        },
        (error) => {
          console.error('Erro ao buscar produto:', error);
        }
      );
    });
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  navigateToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

}
