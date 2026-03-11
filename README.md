# CRUD de Usuários - TypeScript & Node.js

Sistema  de gerenciamento de usuários (Create, Read, Update, Delete) desenvolvido como resolução de desafio técnico. O projeto com autenticação segura, upload de imagens e uma interface responsiva projetada para funcionar de forma totalmente offline.

O objetivo deste repositório é demonstrar fundamentos sólidos em desenvolvimento Web Full-Stack, utilizando TypeScript em ambas as pontas (Frontend e Backend).

---

## Funcionalidades

* **Autenticação JWT:** Sistema de login seguro com senhas criptografadas (via bcrypt). As rotas da API são protegidas por middlewares de verificação.
* **Upload de Arquivos:** Cadastro de usuários com suporte a envio de foto de perfil (utilizando Multer e FormData).
* **Comunicação AJAX:** Toda a interação do frontend com o backend é feita de forma assíncrona utilizando a Fetch API nativa.
* **Interface Offline:** A interface de usuário (UI) foi construída com Bootstrap 5, servido localmente através da pasta node_modules, garantindo que o layout e os modais funcionem sem dependência de internet.
* **Banco de Dados Em Memória:** Utiliza SQLite em memória (:memory:), eliminando a necessidade de configurações externas ou instalação de SGBDs físicos pelo avaliador.

---

## Tecnologias Utilizadas

### Backend
* Node.js com Express
* TypeScript
* SQLite3 (Banco de dados relacional)
* Multer (Gerenciamento de upload de arquivos multipart/form-data)
* Bcrypt & JSON Web Token (Criptografia e Autenticação)
* Dotenv (Gerenciamento de variáveis de ambiente)

### Frontend
* HTML5 & CSS3
* TypeScript / JavaScript (ES6+)
* Fetch API (Requisições assíncronas)
* Bootstrap 5 (Servido localmente)

---

## Como Clonar e Rodar o Projeto

O projeto foi desenhado para rodar de forma simples e direta, ideal para ambientes de teste como distribuições Linux (Ubuntu, Mint, etc.) ou Windows.

### Pré-requisitos
* Node.js instalado (versão 18 ou superior recomendada).

### Passo a Passo

1. Clone o repositório:
   ```bash
   git clone https://github.com/dnnyzap/crud-cadastro-ts.git
   cd crud-cadastro-ts

2. Instale as dependências:
    ```bash
    npm install

3. Compile o código do Frontend (TypeScript para JavaScript):
    ```bash
    npm run build:front

4. Inicie o Servidor BackEnd:
    ```bash
    npm start

5. Acesse a aplicação:

    Abra o seu navegador e acesse: http://localhost:3000


### Credenciais de Acesso (Para Teste)
Como o banco de dados é inicializado em memória, um usuário administrador padrão é criado automaticamente (Seed) ao iniciar o servidor para facilitar a avaliação técnica:

Email: admin@teste.com

Senha: 123456


