const gameRepository = require('../repositories/gameRepository');
const userRepository = require('../repositories/userRepository');

class GameService {
    // funcao q o jogador n ve pra gerar o tabuleiro 5x5
    gerarTabuleiro() {
        // cria um array de 25 slots tudo diamante
        let posicoes = Array(25).fill('DIAMANTE');
        
        let bombas = 0;
        // sorteia 5 espaços aleatorios pra botar as bombas
        while (bombas < 5) {
            let index = Math.floor(Math.random() * 25);
            if (posicoes[index] === 'DIAMANTE') {
                posicoes[index] = 'BOMBA';
                bombas++;
            }
        }

        // pega os 25 e quebra numa matriz 5x5
        let tabuleiro = [];
        for (let i = 0; i < 5; i++) {
            let linha = [];
            for (let j = 0; j < 5; j++) {
                // guarda o conteudo e avisa q a casa ta fechada ainda
                linha.push({ conteudo: posicoes[i * 5 + j], aberta: false });
            }
            tabuleiro.push(linha);
        }
        return tabuleiro;
    }

    // 1. POST /games/start
    async startGame(usuarioId, valorAposta) {
        // regra do pdf: n pode jogar se ja tiver partida em andamento
        const jogoAtivo = await gameRepository.findActiveGameByUser(usuarioId);
        if (jogoAtivo) throw new Error('Você já possui uma partida em andamento.');

        // checa se o mano existe e se tem a grana
        const user = await userRepository.findById(usuarioId);
        if (!user) throw new Error('Usuário não encontrado.');
        if (parseFloat(user.saldo) < valorAposta) throw new Error('Saldo insuficiente para a aposta.');

        // desconta do saldo (manda negativo)
        await userRepository.updateSaldo(usuarioId, -valorAposta);

        // gera o campo e salva no db
        const tabuleiro = this.gerarTabuleiro();
        const novoJogo = await gameRepository.create(usuarioId, valorAposta, tabuleiro);

        // o pdf pede so o id do jogo de retorno aqui
        return { gameId: novoJogo.id };
    }

    // 2. POST /games/{gameId}/reveal
    async reveal(gameId, linha, coluna) {
        const jogo = await gameRepository.findById(gameId);
        if (!jogo) throw new Error('Jogo não encontrado.');
        if (jogo.status !== 'EM_ANDAMENTO') throw new Error('Esta partida já foi encerrada.');

        // matriz comeca no 0, entao vai de 0 a 4
        if (linha < 0 || linha > 4 || coluna < 0 || coluna > 4) {
            throw new Error('Posição inválida. O tabuleiro é 5x5 (linhas e colunas de 0 a 4).');
        }

        const casa = jogo.tabuleiro[linha][coluna];

        // se ja abriu essa posicao o pdf manda avisar pra escolher outra
        if (casa.aberta) {
            throw new Error('Essa posição já foi escolhida, escolha outra.'); 
        }

        // marca como aberta agr
        casa.aberta = true;

        // se achou bomba deu ruim F
        if (casa.conteudo === 'BOMBA') {
            await gameRepository.updateGameState(gameId, 'PERDIDO', jogo.diamantes_encontrados, jogo.tabuleiro);
            return { resultado: 'BOMBA', status: 'PERDIDO' };
        }

        // achou diamante, vamo calcular a grana
        const diamantesAtualizados = jogo.diamantes_encontrados + 1;
        
        // formula que tava no pdf
        const premioAtual = jogo.valor_aposta * (1 + (diamantesAtualizados * 0.33));

        // atualiza a partida e salva no db
        await gameRepository.updateGameState(gameId, 'EM_ANDAMENTO', diamantesAtualizados, jogo.tabuleiro);

        return {
            resultado: 'DIAMANTE',
            diamantesEncontrados: diamantesAtualizados,
            premioAtual: parseFloat(premioAtual.toFixed(2)) // toFixed pra n virar dizima periodica
        };
    }

    // 3. POST /games/{gameId}/cashout
    async cashout(gameId) {
        const jogo = await gameRepository.findById(gameId);
        if (!jogo) throw new Error('Jogo não encontrado.');
        if (jogo.status !== 'EM_ANDAMENTO') throw new Error('Esta partida já foi encerrada ou você perdeu.');

        // calcula o premio final so pra ter ctz
        const premioFinal = jogo.valor_aposta * (1 + (jogo.diamantes_encontrados * 0.33));

        // manda o premio pro saldo do mano
        await userRepository.updateSaldo(jogo.usuario_id, premioFinal);

        // encerra a partida gg
        await gameRepository.updateGameState(gameId, 'VITORIA', jogo.diamantes_encontrados, jogo.tabuleiro);

        return {
            mensagem: 'Cashout realizado com sucesso! O dinheiro já está na sua conta.',
            premio: parseFloat(premioFinal.toFixed(2))
        };
    }
}

module.exports = new GameService();