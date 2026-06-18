const { Pool } = require('pg');
require('dotenv').config();

// criando a "piscina" de conexões usando as variáveis do nosso arquivo .env
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// teste rápido pra garantir que o banco ta mesmo conversando com a API
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Deu ruim na conexão com o banco:', err.stack);
    }
    console.log('Conexão com o PostgreSQL feita com sucesso!');
    release(); // Libera o cliente de volta pra pool
});

// exporta a pool pra gente usar nos Repositories depois
module.exports = {
    query: (text, params) => pool.query(text, params),
};