const db = require('../config/database');

class GameRepository {
    // cria um novo jogo no banco salvando o tabuleiro como JSON
    async create(usuarioId, valorAposta, tabuleiro) {
        const query = `
            INSERT INTO jogos (usuario_id, valor_aposta, tabuleiro)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        // o postgres entende JSON, então usamos JSON.stringify pra converter nossa matriz
        const values = [usuarioId, valorAposta, JSON.stringify(tabuleiro)];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    // verifica se o mano já tem uma partida rolando (regra do PDF)
    async findActiveGameByUser(usuarioId) {
        const query = "SELECT * FROM jogos WHERE usuario_id = $1 AND status = 'EM_ANDAMENTO'";
        const result = await db.query(query, [usuarioId]);
        return result.rows[0];
    }

    // busca um jogo específico pelo ID (vamos usar muito no reveal e no cashout)
    async findById(id) {
        const query = "SELECT * FROM jogos WHERE id = $1";
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // atualiza o status do jogo e os diamantes achados
    async updateGameState(id, status, diamantesEncontrados, tabuleiro) {
        const query = `
            UPDATE jogos
            SET status = $1, diamantes_encontrados = $2, tabuleiro = $3
            WHERE id = $4
            RETURNING *
        `;
        const values = [status, diamantesEncontrados, JSON.stringify(tabuleiro), id];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = new GameRepository();