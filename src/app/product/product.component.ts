import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Router } from '@angular/router'; // Certifique-se de importar o Router

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  product: any = {}; // Produto que será exibido
  productId: string = ''; // Agora o ID é tratado como string
  quantity: number = 1; // Quantidade do produto para a compra

  constructor(private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router // Adicionando o Router aqui
  ) { }

  ngOnInit(): void {
    // Captura o id_prod da URL (agora como string)
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.productId = productId; // Armazena o id_prod como string

      // Log para garantir que estamos capturando o id_prod corretamente
      console.log('Produto ID capturado:', this.productId);

      this.loadProductDetails(this.productId); // Carrega os detalhes do produto
    } else {
      console.error('Product ID não encontrado na URL');
    }
  }

  // Função para carregar os detalhes do produto
  loadProductDetails(productId: string): void {
    this.apiService.getProduct(productId).subscribe({
      next: (response) => {
        if (response.product) {
          this.product = response.product; // Atualiza os detalhes do produto
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

  // Função chamada quando o usuário clica em "Buy Now"
  cart(): void {
    if (this.product.stock < this.quantity) {
      alert('Quantidade solicitada acima do estoque disponível');
      console.warn('Quantidade solicitada acima do estoque disponível');
    } else {
      alert(`Produto adicionado ao carrinho: ${this.product.name_prod}. Quantidade: ${this.quantity}`);
      console.log(`Produto comprado: ${this.product.name_prod}. Quantidade: ${this.quantity}`);
  
      // Redireciona para a página do carrinho, adicionando este produto ao carrinho
      const currentIds = sessionStorage.getItem('cartIds');
      const updatedIds = currentIds ? `${currentIds},${this.productId}` : this.productId;
      sessionStorage.setItem('cartIds', updatedIds);
  
      this.router.navigate(['/cart', { id_prod: updatedIds }]);
    }
  }
  
}
