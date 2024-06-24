### Visão Geral :eyes:

O [Buzzbook](https://buzzbookapi-production.up.railway.app/api) é um sistema de livraria online desenvolvido com o framework NestJS e o banco de dados PostgreSQL. Ele oferece funcionalidades de gerenciamento de livros, categorias, usuários, autenticação, pedidos e estoque. 

### Tecnologias Utilizadas :woman_technologist:

- **Linguagem:** TypeScript
- **Framework:** NestJS
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT (JSON Web Tokens)
- **Gerenciamento de Pacotes:** Yarn
- **Outras:** Argon2 (hash de senhas), Class-transformer e Class-validator (validação de dados)

### Arquitetura :triangular_ruler:

O projeto segue o padrão **Controlador-Serviço-Repositório (CSR)**, uma variação do MVC adaptada para o desenvolvimento de APIs RESTful. O NestJS facilita a implementação dessa arquitetura, fornecendo uma estrutura modular e organizada para os controladores, serviços e repositórios.

- **Controladores (Controllers):** Responsáveis por receber as requisições HTTP, validar os dados de entrada e chamar os serviços apropriados.
- **Serviços (Services):** Implementam a lógica de negócio da aplicação, orquestrando as operações necessárias e interagindo com os repositórios.
- **Repositórios (Repositories):** Abstraem a interação com o banco de dados, utilizando o Prisma Client para realizar operações CRUD (Create, Read, Update, Delete) e consultas.

### Padrões de Projeto :straight_ruler:

- **Repository:** Utilizado para encapsular o acesso ao banco de dados e fornecer uma interface consistente para as operações de CRUD (Create, Read, Update, Delete).
- **Dependency Injection:** Implementado pelo NestJS para gerenciar as dependências entre os componentes da aplicação, tornando o código mais modular e testável.
- **Strategy:** Utilizado para a autenticação, permitindo a flexibilidade de adicionar diferentes estratégias de autenticação (JWT, OAuth, etc.) no futuro.

### Estrutura do Projeto :construction:
`````
buzzbook/
├── dist/                   # Arquivos compilados
├── node_modules/           # Dependências do projeto
├── prisma/                 # Esquema do banco de dados e migrações
├── src/
│   ├── auth/               # Módulo de autenticação (controllers, services, etc.)
│   ├── book/               # Módulo de livros
│   ├── category/           # Módulo de categorias
│   ├── exceptions/         # Filtros de exceção
│   ├── order/              # Módulo de pedidos
│   ├── user/               # Módulo de usuários
│   ├── util/               # Utilitários
│   ├── app.module.ts       # Módulo principal da aplicação
│   └── main.ts             # Ponto de entrada da aplicação
├── test/                   # Testes da aplicação
├── .env                    # Variáveis de ambiente
├── .env.test               # Variáveis de ambiente para testes
├── docker-compose.yml      # Configuração do Docker Compose
├── package.json            # Manifesto do projeto
├── README.md               # Documentação do projeto
├── tsconfig.json           # Configurações do TypeScript
└── yarn.lock               # Arquivos de lock do Yarn
`````
### **Executando o Projeto** :traffic_light:

1. **Pré-requisitos:**
    - Node.js e Yarn instalados
    - Docker e Docker Compose instalados
2. **Clone o repositório:**
    

    
    ```bash
   git clone <URL_DO_REPOSITORIO>
    ```
    
4. **Instale as dependências:**

   ```bash
    yarn install
   ```
    
6. **Configure as variáveis de ambiente:**
    - Crie um arquivo `.env` na raiz do projeto e defina as seguintes variáveis:
        
        `DATABASE_URL=postgresql://<USUARIO>:<SENHA>@<HOST>:<PORTA>/<NOME_DO_BANCO>
        JWT_SECRET=<CHAVE_SECRETA_JWT>`
      - Também um arquivo `.env.test` na raiz do projeto e defina as seguintes variáveis:
        
        `DATABASE_URL=postgresql://<USUARIO>:<SENHA>@<HOST>:<PORTA>/<NOME_DO_BANCO>
        JWT_SECRET=<CHAVE_SECRETA_JWT>`
        
7. **Inicie o banco de dados:**
    - Usando Docker Compose:
        
      ```bash
        docker-compose up -d
      ```
   - Aguarde os containers serem estabelecidos e então rode o próximo comando.

8. **Execute as migrações do banco de dados:**
    
   ```bash
    yarn prisma migrate dev
   ```
    
10. **Inicie a aplicação:**
    
    ```bash
    yarn start:dev
    ```
    - Também é possível rodar o comando abaixo para rodar os 4 comandos de setup de uma vez só.
      ```bash
      yarn setup
      ```    

A aplicação estará disponível em `http://localhost:3333`. O banco de dados pode ser visualizado com o Prisma ao executar o comando: 
   ```bash
npx dotenv -e .env -- prisma studio
```

O link para visualização é: `http://localhost:5555`.

### **Endpoints da API**

A documentação completa dos endpoints da API, incluindo os métodos HTTP, parâmetros e exemplos de requisição e resposta, pode ser encontrada no arquivo `http://localhost:3333/api#` no Swagger. A API também pode ser acessada nesse [https://buzzbookapi-production.up.railway.app/api](https://buzzbookapi-production.up.railway.app/api) com toda a documentação do Swagger.

### **Testes**

O projeto inclui testes unitários e de integração, que podem ser executados com o comando:

```bash
yarn test:e2e
```

O banco de dados de testes pode ser visualizado com o Prisma ao executar o comando:

   ```bash
npx dotenv -e .env.test -- prisma studio
```

O link para visualização é: `http://localhost:5555`.
