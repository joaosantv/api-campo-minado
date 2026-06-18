# API Campo Minado

API REST desenvolvida em Node.js para uma plataforma de apostas baseada no jogo Campo Minado, é um trabalho desenvolvido para a disciplina de back-end do curso de ADS.

## 🚀 Tecnologias Utilizadas
* **Node.js** (v24.15.0)
* **Express.js**
* **PostgreSQL**
* **dotenv**
* **cors**
* **nodemon** (Dev)

## ⚙️ Instalação e Configuração

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/api-campo-minado.git
```

2. Acesse a pasta do projeto:
```bash
cd api-campo-minado
```

3. Instale as dependências:
```bash
npm install
```

4. Crie um arquivo `.env` na raiz do projeto com as credenciais do seu banco de dados PostgreSQL:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campo_minado
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# Server Configuration
PORT=3000
```

5. Crie as tabelas no seu banco de dados PostgreSQL (o script SQL pode ser gerado com base nos Repositories do projeto).

## ▶️ Executando a aplicação

Para rodar o servidor em modo de desenvolvimento:
```bash
npm run dev
```
A API estará disponível em: `http://localhost:3000`

## 🔗 Endpoints Principais

**Autenticação:**
* `POST /auth/register`: Cadastro de usuário
* `POST /auth/login`: Login
* `PATCH /auth/reset-password`: Redefinir senha

**Usuários:**
* `GET /users/{id}`: Buscar perfil do usuário
* `PUT /users/{id}`: Adicionar saldo à carteira
* `DELETE /users/{id}`: Excluir conta
* `GET /users/dashboard`: Estatísticas gerais (Vitórias, derrotas, lucros)

**Jogo (Campo Minado):**
* `POST /games/start`: Inicia um novo jogo (desconta saldo e gera tabuleiro 5x5)
* `POST /games/{gameId}/reveal`: Revela uma posição (linha e coluna)
* `POST /games/{gameId}/cashout`: Encerra a partida e saca o prêmio acumulado