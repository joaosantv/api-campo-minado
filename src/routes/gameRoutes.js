const express = require('express');
const gameController = require('../controllers/gameController');

const router = express.Router();

// rota pra começar a brincadeira
router.post('/start', gameController.startGame);

// rota pra clicar no quadrado (o id do jogo vai dinâmico na url)
router.post('/:gameId/reveal', gameController.reveal);

// rota pra vazar com o dinheiro antes de achar bomba
router.post('/:gameId/cashout', gameController.cashout);

module.exports = router;