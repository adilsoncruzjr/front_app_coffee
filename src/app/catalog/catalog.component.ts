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
        this.totalPages = response.products.last_page; // Total de páginas retornado pela API
      },
      error: (err) => {
        console.error('Erro ao carregar produtos', err);
      }
    });
  }

  // Função para ir para a próxima página
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts(this.currentPage);
    }
  }

  // Função para voltar para a página anterior
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts(this.currentPage);
    }
  }

  // Função para redirecionar para a página de detalhes do produto
  goToProductDetail(productId: string): void {
    this.router.navigate(['/product', productId]); // Redireciona para a rota /product com o id do produto
  }

}
