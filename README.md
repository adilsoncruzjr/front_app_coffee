Aplicação Web para Compra de Café
Este repositório contém o código-fonte do frontend de uma aplicação web desenvolvida como parte de um trabalho acadêmico. O sistema simula uma loja virtual de café, permitindo aos usuários navegar pelos produtos, adicionar itens ao carrinho e simular compras.

A aplicação consome uma API desenvolvida em Laravel, cujo código-fonte está disponível no repositório back_app_coffee.

🚀 Descrição Geral
A aplicação foi desenvolvida com foco em uma interface intuitiva e responsiva, utilizando Angular com Angular Material para atender às melhores práticas de design e usabilidade. O frontend consome uma API RESTful para gerenciar os dados dos produtos, carrinho e compras.

🛠 Tecnologias Utilizadas
Frontend
Angular: Framework JavaScript para desenvolvimento do frontend.
Angular Material: Biblioteca de componentes visuais baseada no Material Design.
Componentes utilizados:
Barra de navegação (NavBar)
Cartões (Cards)
Botões e ícones
Diálogos e tabelas dinâmicas
HTML/CSS: Para estruturação e estilização personalizada.
Integração com a API
A aplicação consome uma API RESTful desenvolvida em Laravel.
Repositório da API: back_app_coffee.
📂 Estrutura do Projeto
src/app/: Contém os componentes, serviços e módulos organizados por funcionalidades.
services/: Implementa as chamadas HTTP para consumir os dados da API.
modules/: Modularização para diferentes partes da aplicação, como catálogo de produtos e carrinho de compras.
🌐 Funcionalidades
Catálogo de Produtos:
Lista dinâmica de cafés disponíveis, com nome, descrição, preço e imagem.
Carrinho de Compras:
Adicionar, visualizar e remover itens.
Integração com API:
Consumo de dados e atualização em tempo real por meio de requisições HTTP.
Interface Responsiva:
Design adaptado para dispositivos móveis, tablets e desktops.
⚙️ Como Rodar o Projeto
Pré-requisitos
Certifique-se de ter instalados:

Node.js (v16 ou superior)
Angular CLI
