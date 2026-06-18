const userRepository = require('../repositories/userRepository');

class UserService {
    async register(userData) {
        const { nome, email, dataNascimento, senha, confirmacaoSenha } = userData;

        // se a senha n bater com a confirmacao barra na hora
        if (senha !== confirmacaoSenha) {
            throw new Error('As senhas não coincidem.');
        }

        // validacao chata de senha (8 letras, maiuscula, numero e especial)
        const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!senhaRegex.test(senha)) {
            throw new Error('A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial.');
        }

        // ve se o email ja existe pra n dar BO de duplicidade
        const userExists = await userRepository.findByEmail(email);
        if (userExists) {
            throw new Error('Este e-mail já está cadastrado no sistema.');
        }

        const newUser = await userRepository.create(nome, email, dataNascimento, senha);
        return newUser;
    }

    async login(email, senha) {
        const user = await userRepository.findByEmail(email);

        if (!user || user.senha !== senha) {
            throw new Error('E-mail ou senha incorretos.');
        }

        // o pdf pede pra retornar estritamente esses 3 campos, nada de senha ou saldo
        return {
            nome: user.nome,
            email: user.email,
            dataNascimento: user.data_nascimento
        };
    }

    async resetPassword(userData) {
        const { id, novaSenha } = userData;

        const user = await userRepository.findByIdAuth(id);
        if (!user) throw new Error('Usuário não encontrado.');

        if (user.senha === novaSenha) {
            throw new Error('A nova senha não pode ser igual à senha atual.');
        }

        const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!senhaRegex.test(novaSenha)) {
            throw new Error('A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial.');
        }

        await userRepository.updatePassword(id, novaSenha);
        return { mensagem: 'Senha atualizada com sucesso!' };
    }

    async getUserProfile(id) {
        const user = await userRepository.findById(id);
        if (!user) throw new Error('Usuário não encontrado.');
        return user;
    }

    async addSaldo(id, saldo) {
        // nao deixa colocar saldo negativo igual ta no pdf
        if (saldo < 0) {
            throw new Error('Não é permitido cadastrar saldo negativo.');
        }
        return await userRepository.updateSaldo(id, saldo);
    }

    async deleteUser(id) {
        await userRepository.delete(id);
    }

    async getDashboard(usuarioId) {
        const stats = await userRepository.getDashboardStats(usuarioId);
        
        // trata os nulos e joga tudo formatadinho pro padrao do pdf com duas casas decimais
        return {
            totalJogos: parseInt(stats.total_jogos) || 0,
            vitorias: parseInt(stats.vitorias) || 0,
            derrotas: parseInt(stats.derrotas) || 0,
            valorGanho: parseFloat(stats.valor_ganho || 0).toFixed(2),
            valorPerdido: parseFloat(stats.valor_perdido || 0).toFixed(2)
        };
    }
}

module.exports = new UserService();