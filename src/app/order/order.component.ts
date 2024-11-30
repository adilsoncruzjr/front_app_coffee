import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  cartId: number = 0;
  finalValue: string = '';
  products: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.cartId = +params['id_car'];
      console.log('ID do carrinho:', this.cartId);
      this.getOrderDetails();
    });
  }

  getOrderDetails(): void {
    this.apiService.getOrderDetails(this.cartId).subscribe(
      (response: any) => {
        console.log('Detalhes do pedido:', response);
        this.finalValue = response.final_value_car;
        this.getProductsDetails(response.id_prod_q);
      },
      (error) => {
        console.error('Erro ao buscar os detalhes do pedido:', error);
      }
    );
  }

  getProductsDetails(productIds: string[]): void {
    productIds.forEach(id_prod => {
      this.apiService.getProduct(id_prod).subscribe(
        (response: any) => {
          console.log('Produto:', response.product);
          this.products.push(response.product);
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
