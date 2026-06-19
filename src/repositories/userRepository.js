const db = require('../config/database');

class UserRepository {
    // busca o usuario pelo email pra ver se n tem duplicado no db
    async findByEmail(email) {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    // insere o novo usuário na tabela do banco de dados
    async create(nome, email, dataNascimento, senha) {
        const query = `
            INSERT INTO usuarios (nome, email, data_nascimento, senha)
            VALUES ($1, $2, $3, $4)
            RETURNING id, nome, email, data_nascimento, saldo
        `;
        const values = [nome, email, dataNascimento, senha];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    // pega o id do usuario e traz a senha junto pro reset de senha
    async findByIdAuth(id) {
        const query = 'SELECT * FROM usuarios WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // pega o perfil do usuário sem retornar o hash da senha
    async findById(id) {
        const query = 'SELECT id, nome, email, saldo FROM usuarios WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // manda atualizar a senha velha pra nova lá no banco
    async updatePassword(id, novaSenha) {
        const query = 'UPDATE usuarios SET senha = $1 WHERE id = $2';
        await db.query(query, [novaSenha, id]);
    }

    // injeta a grana na conta do jogador
    async updateSaldo(id, valor) {
        const query = 'UPDATE usuarios SET saldo = saldo + $1 WHERE id = $2 RETURNING id, nome, saldo';
        const result = await db.query(query, [valor, id]);
        return result.rows[0];
    }

    // deleta o usuario (e o cascade que a gnt fez no banco leva os jogos junto)
    async delete(id) {
        const query = 'DELETE FROM usuarios WHERE id = $1';
        await db.query(query, [id]);
    }

    // faz o select bruto pra calcular as estatísticas do dashboard direto no postgres
    async getDashboardStats(usuarioId) {
        const query = `
            SELECT 
                COUNT(id) AS total_jogos,
                COUNT(CASE WHEN status = 'VITORIA' THEN 1 END) AS vitorias,
                COUNT(CASE WHEN status = 'PERDIDO' THEN 1 END) AS derrotas,
                SUM(CASE WHEN status = 'VITORIA' THEN (valor_aposta * (1 + (diamantes_encontrados * 0.33))) - valor_aposta ELSE 0 END) AS valor_ganho,
                SUM(CASE WHEN status = 'PERDIDO' THEN valor_aposta ELSE 0 END) AS valor_perdido
            FROM jogos 
            WHERE usuario_id = $1
        `;
        const result = await db.query(query, [usuarioId]);
        return result.rows[0];
    }
}

module.exports = new UserRepository();