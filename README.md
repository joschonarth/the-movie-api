# 🎬 The Movie API

Este projeto é uma **API de Filmes** que se integra à API do **The Movie Database (TMDB)** para buscar informações sobre filmes. Ele permite que os usuários adicionem filmes à lista de desejos, atualizem o estado de um filme, avaliem filmes e muito mais.

## 🛠️ Tecnologias Utilizadas

- 🟢 **Node.js**: Plataforma para execução do JavaScript no servidor.
- 🟦 **TypeScript**: Superset do JavaScript com tipagem estática.
- ⚡ **Fastify**: Framework web de alta performance para Node.js.
- 🛢️ **Prisma**: ORM (Object Relational Mapper) para banco de dados.
- 🗄️ **PostgreSQL**: Banco de dados relacional utilizado para armazenar informações.
- 🐳 **Docker**: Containerização da aplicação.
- 💎 **Zod**: Validação de esquemas e dados.
- 📜 **Swagger**: Documentação automática da API.
- ✨ **Axios**: Cliente HTTP para fazer requisições à API do TMDB.
- ⚙️ **ESLint**: Linter para garantir a qualidade do código.
- 🧪 **Vitest**: Framework de testes.
- 🔨 **Tsup**: Ferramenta para bundling.

## ⚙️ Funcionalidades

- 🎥 **Adicionar filme à lista de desejos:** Adicione um filme à sua lista pessoal.
- 📄 **Listar todos os filmes:** Retorne todos os filmes presentes na sua lista, com paginação e filtros.
- 🔍 **Buscar informações de um filme específico:** Pesquise informações detalhadas sobre um filme.
- 🔄 **Atualizar o estado de um filme:** Alterar o estado de um filme (de "a assistir" para "assistido", por exemplo).
- ⭐ **Avaliar um filme:** Dê uma nota para o filme de 0 a 5.
- 📖 **Histórico de ações:** Visualize o histórico de ações relacionadas a um filme (adicionado, avaliado, etc).
- 📊 **Logs das requisições:** Visualize os logs das requisições feitas na API.

## 🔑 Obtenha a sua API Key do TMDB

Antes de acessar a aplicação, é necessário criar uma conta no **TMDB** e obter uma API Key.

1. Acesse [The Movie Database (TMDB)](https://www.themoviedb.org/) e crie uma conta.
2. Após criar a conta, vá até as [Configurações da API](https://www.themoviedb.org/settings/api) e gere sua API Key.
3. Copie essa chave e configure no arquivo `.env` da aplicação a variável `TMDB_API_KEY` (veja a seção de instalação para mais detalhes).

## 🔧 Instalação

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/joschonarth/the-movie-api.git
    cd the-movie-api
    ```

2. **Crie um arquivo `.env` a partir do exemplo:**

    O projeto já contém um arquivo `.env.example` com os exemplos de variáveis de ambiente que você precisa configurar. Copie para `.env` e preencha as informações de acordo com suas necessidades.

3. **Instale as dependências:**

    ```bash
    npm install
    ```

4. **Execute as migrações do banco de dados:**

    ```bash
    npx prisma migrate dev
    ```

5. **Rodando a aplicação localmente:**

    Para rodar a aplicação localmente, execute o seguinte comando:

    ```bash
    npm run dev
    ```

    A aplicação estará disponível em [http://localhost:3333](http://localhost:3333).

## 🐳 Rodando a aplicação com Docker

Este projeto está containerizado usando o **Docker**. Para rodar a aplicação em um container Docker, utilize o seguinte comando:

  ```bash
  docker-compose up --build
  ```

A aplicação estará disponível em [http://localhost:3333](http://localhost:3333) dentro do container.

## 🔒 Autenticação

Todas as rotas da API estão protegidas por **Basic Auth**. Para autenticação, utilize as seguintes variáveis de ambiente:

```env
ADMIN_USER=admin
ADMIN_PASSWORD=admin123
```

Se estiver usando uma ferramenta como **Postman** para testar a API, siga os passos abaixo:

1. Selecione a requisição desejada.
2. Vá até a aba de **Authorization**.
3. Em **Auth Type** escolha o método **Basic Auth**.
4. Informe o usuário e senha configurados nas variáveis de ambiente.
5. Envie a requisição normalmente.

Caso esteja utilizando `cURL`, você pode passar as credenciais da seguinte forma:

```sh
curl -u admin:admin123 http://localhost:3333/movie
```

Caso esteja utilizando `httpie`, você pode passar as credenciais da seguinte forma:

```bash
http -a admin:admin123 http://localhost:3333/movie
```

## 🔗 Endpoints

### 🎥 Adicionar Filme à Lista de Desejos

- **Descrição:** Adiciona um filme à lista de desejos.
- **Método**: `POST`
- **URL**: `/movie`
- **Corpo da Requisição:**  

  ```json
  {
    "title": "Interstellar"
  }
  ```

- **Exemplo de Resposta:**  

  ```json
  {
    "message": "Movie added successfully"
  }
  ```

### 📄 Listar Filmes

- **Descrição:** Retorna uma lista de filmes cadastrados. Possui suporte a paginação e filtros.
- **Método**: `GET`
- **URL**: `/movie`
- **Query Params**:
    - `state`: Filtra os filmes pelo estado. Pode ser "`to_watch`", "`watched`", "`rated`" "`recommended`", "`no_recommended`".
    - `limit`: Define o número máximo de filmes por página. Exemplo: `limit=10`.
    - `page`: Define a página de busca. Exemplo: `page=1`.

- **Exemplo de Requisição**:

```url
GET /movie?state=watched&limit=10&page=1
```

- **Exemplo de Resposta:**

  ```json
    {
        "data": [
            {
            "id": "ae44ae5b-7d56-483a-8283-289c784ee91d",
            "title": "Interstellar",
            "synopsis": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
            "releaseYear": 2014,
            "genre": "Adventure, Drama, Science Fiction",
            "state": "WATCHED",
            "rating": null,
            "createdAt": "2025-02-09T19:16:02.882Z"
            }
        ],
        "pagination": {
            "limit": 10,
            "currentPage": 1,
            "totalPages": 1,
            "totalItems": 1
        }
    }
  ```

### 🔍 Buscar Filme

- **Descrição:** Busca informações detalhadas de um filme específico.
- **Método**: `GET`
- **URL**: `/movie/:id`
- **Parâmetros de URL:**  
  `id`: ID do filme.

- **Exemplo de Resposta:**

  ```json
  {
    "id": "ae44ae5b-7d56-483a-8283-289c784ee91d",
    "title": "Interstellar",
    "synopsis": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    "releaseYear": 2014,
    "genre": "Adventure, Drama, Science Fiction",
    "state": "TO_WATCH",
    "rating": null,
    "createdAt": "2025-02-09T19:16:02.882Z"
  }
  ```

### 🔄 Atualizar o Estado de um Filme

- **Descrição:** Atualiza o estado de um filme (ex: "a assistir" para "assistido").
- **Método**: `PUT`
- **URL**: `/movie/:id/state`
- **Parâmetros de URL:**  
  `id`: ID do filme.
- **Corpo da Requisição:**  

  ```json
  {
    "state": "watched"
  }
  ```

- **Exemplo de Resposta:**

  ```json
  {
    "id": "ae44ae5b-7d56-483a-8283-289c784ee91d",
    "title": "Interstellar",
    "synopsis": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    "releaseYear": 2014,
    "genre": "Adventure, Drama, Science Fiction",
    "state": "WATCHED",
    "rating": null,
    "createdAt": "2025-02-09T19:16:02.882Z"
  }
  ```

### ⭐ Avaliar um Filme

- **Descrição:** Avalia um filme de 0 a 5.
- **Método**: `POST`
- **URL**: `/movie/:id/rate`
- **Parâmetros de URL:**  
  `id`: ID do filme.
- **Corpo da Requisição:**  

  ```json
  {
    "rating": 5
  }
  ```

- **Exemplo de Resposta:**

  ```json
  {
    "id": "ae44ae5b-7d56-483a-8283-289c784ee91d",
    "title": "Interstellar",
    "synopsis": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    "releaseYear": 2014,
    "genre": "Adventure, Drama, Science Fiction",
    "state": "RATED",
    "rating": 5,
    "createdAt": "2025-02-09T19:16:02.882Z"
  }
  ```

### 📖 Histórico do Filme

- **Descrição:** Exibe o histórico de ações de um filme.
- **Método**: `GET`
- **URL**: `/movie/:id/history`
- **Parâmetros de URL:**  
  `id`: ID do filme.

- **Exemplo de Resposta:**

  ```json
  {
    "movieId": "ae44ae5b-7d56-483a-8283-289c784ee91d",
    "title": "Interstellar",
    "history": [
      {
        "method": "GET",
        "url": "/movie/ae44ae5b-7d56-483a-8283-289c784ee91d",
        "status": 200,
        "timestamp": "2025-02-09T19:17:32.334Z",
        "user": "a945afc7-f5c3-40ee-a865-94f3623d8c16"
      },
      {
        "method": "PUT",
        "url": "/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/state",
        "status": 200,
        "timestamp": "2025-02-09T19:18:05.061Z",
        "user": "a945afc7-f5c3-40ee-a865-94f3623d8c16"
      },
      {
        "method": "POST",
        "url": "/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/rate",
        "status": 200,
        "timestamp": "2025-02-09T19:18:37.476Z",
        "user": "a945afc7-f5c3-40ee-a865-94f3623d8c16"
      },
      {
        "method": "GET",
        "url": "/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/history",
        "status": 200,
        "timestamp": "2025-02-09T19:19:06.466Z",
        "user": "a945afc7-f5c3-40ee-a865-94f3623d8c16"
      }
    ]
  }

  ```

### 📊 Logs das Requisições

- **Descrição:** Exibe os logs de todas as requisições feitas à API.
- **Método**: `GET`
- **URL**: `/log`

- **Exemplo de Resposta:**

  ```json
  [
    {
      "id": "971962dd-2ce5-4c27-b3cc-3da71fe9d550",
      "type": "REQUEST",
      "method": "GET",
      "url": "/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/history",
      "status": 200,
      "timestamp": "2025-02-09T19:19:06.466Z",
      "movieId": "ae44ae5b-7d56-483a-8283-289c784ee91d",
      "userId": "a945afc7-f5c3-40ee-a865-94f3623d8c16"
    },
    {
      "id": "1b540827-705a-4ee2-afba-536ef3d91558",
      "type": "REQUEST",
      "method": "POST",
      "url": "/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/rate",
      "status": 200,
      "timestamp": "2025-02-09T19:18:37.476Z",
      "movieId": "ae44ae5b-7d56-483a-8283-289c784ee91d",
      "userId": "a945afc7-f5c3-40ee-a865-94f3623d8c16"
    },
    {
      "id": "261cab53-f903-4d38-8422-b64000017b78",
      "type": "REQUEST",
      "method": "PUT",
      "url": "/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/state",
      "status": 200,
      "timestamp": "2025-02-09T19:18:05.061Z",
      "movieId": "ae44ae5b-7d56-483a-8283-289c784ee91d",
      "userId": "a945afc7-f5c3-40ee-a865-94f3623d8c16"
    },
    {
      "id": "b7f4ca7b-54aa-4e04-9d9d-85682ef065bf",
      "type": "REQUEST",
      "method": "GET",
      "url": "/movie/ae44ae5b-7d56-483a-8283-289c784ee91d",
      "status": 200,
      "timestamp": "2025-02-09T19:17:32.334Z",
      "movieId": "ae44ae5b-7d56-483a-8283-289c784ee91d",
      "userId": "a945afc7-f5c3-40ee-a865-94f3623d8c16"
    },
    {
      "id": "b61a3012-ad80-4f20-9955-815169876a53",
      "type": "REQUEST",
      "method": "GET",
      "url": "/movie",
      "status": 200,
      "timestamp": "2025-02-09T19:16:55.628Z",
      "movieId": null,
      "userId": "a945afc7-f5c3-40ee-a865-94f3623d8c16"
    },
    {
      "id": "e0e7f05d-27d0-465a-82ae-52dbf58142d0",
      "type": "REQUEST",
      "method": "POST",
      "url": "/movie",
      "status": 201,
      "timestamp": "2025-02-09T19:16:02.278Z",
      "movieId": "ae44ae5b-7d56-483a-8283-289c784ee91d",
      "userId": "a945afc7-f5c3-40ee-a865-94f3623d8c16"
    }
  ]
  ```

## 📝 Documentação da API com Swagger

A documentação da API foi criada utilizando **Swagger**. Você pode acessá-la em [http://localhost:3333/docs](http://localhost:3333/docs) após rodar a aplicação.

## 🧪 Testes

Este projeto utiliza o **Vitest** para garantir a confiabilidade e o funcionamento correto dos recursos implementados. Para executar os testes, utilize o seguinte comando:  

```bash
npm run test
```

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests com melhorias ou correções. 🚀

## 📜 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## 📞 Contato

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/joschonarth/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:joschonarth@gmail.com)
