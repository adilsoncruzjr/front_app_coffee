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
    // Captura o id_prod da URL
    const productId = this.route.snapshot.paramMap.get('id');
    const image = this.route.snapshot.queryParamMap.get('image'); // Captura a imagem da query param
  
    if (productId) {
      this.productId = productId;
      this.loadProductDetails(this.productId, image); // Passa a imagem para ser usada após o carregamento
    } else {
      console.error('Product ID não encontrado na URL');
    }
  }
  
  loadProductDetails(productId: string, image: string | null): void {
    this.apiService.getProduct(productId).subscribe({
      next: (response) => {
        if (response.product) {
          this.product = response.product; // Carrega os detalhes do produto
          if (image) {
            this.product.image = image; // Restaura a imagem capturada do query param
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

  // Função chamada quando o usuário clica em "Buy Now"
  cart(): void {
    if (this.product.stock < this.quantity) {
      alert('Quantidade solicitada acima do estoque disponível');
      console.warn('Quantidade solicitada acima do estoque disponível');
    } else {
      alert(`Produto adicionado ao carrinho: ${this.product.name_prod}. Quantidade: ${this.quantity}`);
      console.log(`Produto comprado: ${this.product.name_prod}. Quantidade: ${this.quantity}`);

      // Recupera os produtos atuais do Local Storage
      const savedProducts = localStorage.getItem('cartProducts');
      const products = savedProducts ? JSON.parse(savedProducts) : [];

      // Verifica se o produto já está no carrinho
      const existingProduct = products.find((p: any) => p.id_prod === this.product.id_prod);
      if (existingProduct) {
        // Atualiza a quantidade do produto existente
        existingProduct.quantity += this.quantity;
      } else {
        // Adiciona um novo produto
        const newProduct = { ...this.product, quantity: this.quantity };
        products.push(newProduct);
      }

      // Atualiza o Local Storage
      localStorage.setItem('cartProducts', JSON.stringify(products));

      // Navega para a página do carrinho
      this.router.navigate(['/cart']);
    }
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  // Método para redirecionar para a página de catálogo
  navigateToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}
