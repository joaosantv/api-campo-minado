const userService = require('../services/userService');

class AuthController {
    async register(req, res) {
        try {
            // pega o que veio no body do postman/front
            const userData = req.body;

            // joga pro service fazer a magica das validacoes
            const newUser = await userService.register(userData);

            // retorna status 201 e os dados
            res.status(201).json({
                mensagem: 'Usuário criado com sucesso!',
                usuario: newUser
            });
        } catch (error) {
            // se o service der erro (ex: senha errada), cai aqui
            res.status(400).json({ erro: error.message });
        }
    }

    async login(req, res) {
        try {
            // puxa email e senha do body
            const { email, senha } = req.body;

            // tenta logar
            const userData = await userService.login(email, senha);

            // status 200 é sucesso padrao
            res.status(200).json(userData);
        } catch (error) {
            // 401 = nao autorizado
            res.status(401).json({ erro: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            // manda pro service ver se a senha bate com as regras
            const result = await userService.resetPassword(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = new AuthController();