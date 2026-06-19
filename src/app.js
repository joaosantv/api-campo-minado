// puxa as variaveis do .env pra nao deixar senha vazada no github
require('dotenv').config(); 
// chama a conexao do banco pra iniciar junto com o servidor
require('./config/database');

const express = require('express');
const cors = require('cors');

// importando as rotas que a gente criou
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();

// middlewares basicos
app.use(cors()); // libera a api pra receber requisicoes sem dar erro de cors
app.use(express.json()); // faz o express conseguir ler o formato JSON no corpo das requisicoes

// conectando as rotas nos caminhos certos pra organizar a casa
app.use('/auth', authRoutes); // rotas de cadastro, login e reset de senha
app.use('/users', userRoutes); // rotas de perfil, saldo e dashboard
app.use('/games', gameRoutes); // rotas pra iniciar e jogar o campo minado

// rota de teste pra ter certeza que o servidor tá funcionando
app.get('/', (req, res) => {
    res.json({ mensagem: 'API do Campo Minado rodando liso!' });
});

// define a porta do servidor com fallback para 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});