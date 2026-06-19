class Game {
    constructor(id, usuarioId, valorAposta, status = 'EM_ANDAMENTO', diamantesEncontrados = 0, tabuleiro = []) {
        this.id = id;
        this.usuarioId = usuarioId; // Chave estrangeira ligando ao Usuário
        this.valorAposta = valorAposta;
        this.status = status;
        this.diamantesEncontrados = diamantesEncontrados;
        this.tabuleiro = tabuleiro; // Matriz 5x5 guardada como JSON
    }
}

module.exports = Game;