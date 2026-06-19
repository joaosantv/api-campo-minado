const express = require('express');
const gameController = require('../controllers/gameController');

const router = express.Router();

// rota para iniciar uma nova partida
router.post('/start', gameController.startGame);

// rota pra clicar no quadrado (o id do jogo vai dinâmico na url)
router.post('/:gameId/reveal', gameController.reveal);

// rota para sacar o premio acumulado
router.post('/:gameId/cashout', gameController.cashout);

module.exports = router;