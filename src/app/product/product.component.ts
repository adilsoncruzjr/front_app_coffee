import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  product: any = {};
  productId: string = '';
  quantity: number = 1;


  constructor(private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    const image = this.route.snapshot.queryParamMap.get('image');

    if (productId) {
      this.productId = productId;
      this.loadProductDetails(this.productId, image);
    } else {
      console.error('Product ID não encontrado na URL');
    }
  }

  loadProductDetails(productId: string, image: string | null): void {
    this.apiService.getProduct(productId).subscribe({
      next: (response) => {
        if (response.product) {
          this.product = response.product;
          if (image) {
            this.product.image = image;
          }
          console.log('Produto carregado:', this.product);
        } else {
          console.error('Produto não encontrado');
        }
      },
      error: (err) => {
        console.error('Erro ao carregar produto', err);
      }
    });
  }


  cart(): void {
    if (this.product.stock < this.quantity) {
      alert('Quantidade solicitada acima do estoque disponível');
      console.warn('Quantidade solicitada acima do estoque disponível');
    } else {
      alert(`Produto adicionado ao carrinho: ${this.product.name_prod}. Quantidade: ${this.quantity}`);
      console.log(`Produto comprado: ${this.product.name_prod}. Quantidade: ${this.quantity}`);


      const savedProducts = localStorage.getItem('cartProducts');
      const products = savedProducts ? JSON.parse(savedProducts) : [];


      const existingProduct = products.find((p: any) => p.id_prod === this.product.id_prod);
      if (existingProduct) {

        existingProduct.quantity += this.quantity;
      } else {

        const newProduct = { ...this.product, quantity: this.quantity };
        products.push(newProduct);
      }


      localStorage.setItem('cartProducts', JSON.stringify(products));


      this.router.navigate(['/cart']);
    }
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }


  navigateToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}
