# 🎬 The Movie API

Este projeto é uma **API de Filmes** que se integra à **API do TMDB** (The Movie Database) para buscar informações sobre filmes. Ele permite que os usuários adicionem filmes à lista de desejos, atualizem o estado de um filme, avaliem filmes e muito mais.

## 🛠️ Tecnologias Utilizadas

- 🟩 **Node.js**: Plataforma para execução do JavaScript no servidor.
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
- 📄 **Listar todos os filmes:** Retorne todos os filmes presentes na sua lista.
- 🔍 **Buscar informações de um filme específico:** Pesquise informações detalhadas sobre um filme.
- 🔄 **Atualizar o estado de um filme:** Alterar o estado de um filme (de "a assistir" para "assistido", por exemplo).
- ⭐ **Avaliar um filme:** Dê uma nota para o filme de 0 a 5.
- 📖 **Histórico de ações:** Visualize o histórico de ações relacionadas a um filme (adicionado, avaliado, etc).
- 📊 **Logs das requisições:** Visualize os logs das requisições feitas na API.

## 🎬

## 🔧 Instalação

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/usuario/movie-api.git
    ```

2. **Instale as dependências:**

    ```bash
    cd movie-api
    npm install
    ```

3. **Crie um arquivo `.env` a partir do exemplo:**

    O projeto já contém um arquivo `.env.example` com os exemplos de variáveis de ambiente que você precisa configurar. Copie para `.env` e preencha as informações de acordo com suas necessidades.

4. **Obtenha a sua chave de API do TMDB:**

    Para usar a API do TMDB, você precisa de uma chave de API. Para isso, crie uma conta no [TMDB](https://www.themoviedb.org/) e acesse sua chave de API. Adicione essa chave no arquivo `.env` nas variáveis `TMDB_API_KEY`.

5. **Rodando a aplicação localmente:**

    Para rodar a aplicação localmente, execute o seguinte comando:

    ```bash
    npm run dev
    ```

    A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## 🐳 Rodando a aplicação com Docker

Este projeto está containerizado usando o **Docker**. Para rodar a aplicação em um container Docker, utilize o seguinte comando:

1. **Construa a imagem Docker:**

    ```bash
    docker build -t movie-api .
    ```

2. **Inicie o container Docker:**

    ```bash
    docker run -p 3000:3000 movie-api
    ```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000) dentro do container.

## 🔗 Endpoints

### 🎥 `POST /movie`

- **Descrição:** Adiciona um filme à lista de desejos.
- **Corpo da Requisição:**  

  ```json
  {
    "title": "Interstellar"
  }
  ```

- **Resposta:**  

  ```json
  {
    "message": "Movie added successfully"
  }
  ```

### 📄 Listar Filmes

- **Descrição:** Retorna uma lista de filmes cadastrados. Possui suporte a paginação e filtros.
- **Método**: `GET`
- **URL**: `/movie
- **Query Params**:
    - `state`: Filtra os filmes pelo estado. Pode ser "`to_watch`", "`watched`", "`rated`", "`recommended`" "`no_recommended`".
    - `limit`: Define o número máximo de filmes por página. Exemplo: `limit=10`.
    - `page`: Define a página de busca. Exemplo: `page=1`.

- **Exemplo de Requisição**:

```bash
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

### 🔍 `GET /movie/:id`

- **Descrição:** Busca informações detalhadas de um filme específico.
- **Parâmetros de URL:**  
  `id`: ID do filme.
- **Resposta:**  
  Status: `200 OK`

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

### 🚀 `PUT /movie/:id/state`

- **Descrição:** Atualiza o estado de um filme (ex: "a assistir" para "assistido").
- **Parâmetros de URL:**  
  `id`: ID do filme.
- **Corpo da Requisição:**  

  ```json
  {
    "state": "string"
  }
  ```

- **Resposta:**  
  Status: `200 OK`

  ```json
  {
    "id": 1,
    "title": "Inception",
    "state": "watched"
  }
  ```

### 🚀 `POST /movie/:id/rate`

- **Descrição:** Avalia um filme de 0 a 5.
- **Parâmetros de URL:**  
  `id`: ID do filme.
- **Corpo da Requisição:**  

  ```json
  {
    "rating": 4
  }
  ```

- **Resposta:**  
  Status: `201 Created`

  ```json
  {
    "id": 1,
    "title": "Inception",
    "rating": 4
  }
  ```

### 🚀 `GET /movie/:id/history`

- **Descrição:** Exibe o histórico de ações de um filme.
- **Parâmetros de URL:**  
  `id`: ID do filme.
- **Resposta:**  
  Status: `200 OK`

  ```json
  [
    {
      "action": "added",
      "timestamp": "2025-02-10T12:00:00Z"
    },
    {
      "action": "rated",
      "rating": 4,
      "timestamp": "2025-02-10T13:00:00Z"
    }
  ]
  ```

### 🚀 `GET /log`

- **Descrição:** Exibe os logs de todas as requisições feitas à API.
- **Resposta:**  
  Status: `200 OK`

  ```json
  [
    {
      "timestamp": "2025-02-10T12:00:00Z",
      "method": "POST",
      "endpoint": "/movie",
      "status": "201 Created"
    },
    {
      "timestamp": "2025-02-10T12:30:00Z",
      "method": "GET",
      "endpoint": "/movie/1",
      "status": "200 OK"
    }
  ]
  ```

## 📝 Documentação da API com Swagger

A documentação da API foi criada utilizando **Swagger**. Você pode acessá-la em [http://localhost:3000/docs](http://localhost:3000/docs) após rodar a aplicação.

## 🤖 Como Testar

- **Adicionar um filme à lista:** Envie uma requisição `POST` para `/movie` com o nome do filme.
- **Listar todos os filmes:** Envie uma requisição `GET` para `/movie` para obter todos os filmes adicionados.
- **Buscar informações de um filme:** Envie uma requisição `GET` para `/movie/:id` para buscar detalhes sobre um filme.
- **Avaliar um filme:** Envie uma requisição `POST` para `/movie/:id/rate` com a avaliação de 0 a 5.
- **Visualizar o histórico de ações:** Envie uma requisição `GET` para `/movie/:id/history` para ver o histórico de ações relacionadas a um filme.

## 🤝 Contribuições

Sinta-se à vontade para abrir issues ou pull requests com melhorias ou correções. 🚀

## 📜 Licença 

Este projeto está licenciado sob a [MIT License](LICENSE).
