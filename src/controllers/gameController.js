const gameService = require('../services/gameService');

class GameController {
    async startGame(req, res) {
        try {
            // pega o id do cara e o valor da aposta que vieram no postman/front
            const { idUser, valorAposta } = req.body;

            // manda pro service iniciar a parada e gerar o tabuleiro
            const gameInfo = await gameService.startGame(idUser, valorAposta);

            // status 201 pq a gente literalmente criou uma partida nova no banco
            res.status(201).json(gameInfo);
        } catch (error) {
            // se o mano tiver sem saldo ou já tiver jogando, o erro cai aqui
            res.status(400).json({ erro: error.message });
        }
    }

    async reveal(req, res) {
        try {
            // pega o id do jogo direto da url (ex: /games/1/reveal)
            const { gameId } = req.params;
            
            // pega a linha e coluna que o jogador quer abrir
            const { linha, coluna } = req.body;

            // manda processar a jogada pra ver se é bomba ou diamante
            const resultado = await gameService.reveal(gameId, linha, coluna);

            res.status(200).json(resultado);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    async cashout(req, res) {
        try {
            // pega o id do jogo da url
            const { gameId } = req.params;

            // manda encerrar a partida e pagar o premio pro mano
            const resultado = await gameService.cashout(gameId);

            res.status(200).json(resultado);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = new GameController();