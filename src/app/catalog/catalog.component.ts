import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {

  products: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 6;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts(this.currentPage);
  }

  loadProducts(page: number): void {
    this.apiService.getProducts(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.products = response.products.data;
        this.totalPages = response.products.last_page;
        console.log('Produtos carregados:', this.products);
        this.assignRandomImages();
      },
      error: (err) => {
        console.error('Erro ao carregar produtos', err);
      }
    });
  }

  assignRandomImages(): void {
    const imageUrls = [
      'images/1.jpg',
      'images/2.jpg',
      'images/3.jpg',
      'images/4.jpg',
      'images/5.jpg',
      'images/6.jpg',
      'images/7.jpg',
      'images/8.jpg',
      'images/9.jpg',
      'images/10.jpg',
      'images/11.jpg',
      'images/12.jpg'
    ];

    this.products = this.products.map(product => {
      const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      return {
        ...product,
        image: randomImage
      };
    });

    console.log('Produtos com imagens atribuídas:', this.products);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      console.log(`Mudando para a próxima página: ${this.currentPage}`);
      this.loadProducts(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      console.log(`Voltando para a página anterior: ${this.currentPage}`);
      this.loadProducts(this.currentPage);
    }
  }

  goToProductDetail(product: any): void {
    this.router.navigate(['/product', product.id_prod], {
      queryParams: { image: product.image }
    });
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

}
