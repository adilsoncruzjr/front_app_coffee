import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {

  products: any[] = []; // Lista de produtos carregados
  currentPage: number = 1; // Página atual
  totalPages: number = 1; // Total de páginas
  itemsPerPage: number = 6; // Itens por página

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Carregar produtos ao inicializar
    this.loadProducts(this.currentPage);
  }

  // Função para carregar produtos
  loadProducts(page: number): void {
    this.apiService.getProducts(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.products = response.products.data; // Ajuste conforme o formato real da API
        this.totalPages = response.products.last_page; // Total de páginas
        console.log('Produtos carregados:', this.products);  // Depuração
        this.assignRandomImages();  // Atribui imagens aleatórias
      },
      error: (err) => {
        console.error('Erro ao carregar produtos', err);
      }
    });
  }

   // Função para atribuir imagens aleatórias aos produtos
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

    // Atribui uma imagem aleatória para cada produto
    this.products = this.products.map(product => {
      const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      return {
        ...product,
        image: randomImage  // A imagem aleatória é atribuída à propriedade `image` de cada produto
      };
    });

    console.log('Produtos com imagens atribuídas:', this.products);  // Log para verificar
  }


  // Função para ir para a próxima página
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

  // Função para redirecionar para a página de detalhes do produto
  goToProductDetail(product: any): void {
    this.router.navigate(['/product', product.id_prod], { 
      queryParams: { image: product.image } // Passa a imagem como query param
    });
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

}
