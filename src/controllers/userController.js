const userService = require('../services/userService');

class UserController {
    async getProfile(req, res) {
        try {
            // puxa o id da url
            const { id } = req.params;
            const user = await userService.getUserProfile(id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    }

    async updateSaldo(req, res) {
        try {
            const { id } = req.params;
            const { saldo } = req.body;
            
            // limita a duas casas decimais igual o professor pediu
            const saldoFormatado = parseFloat(saldo).toFixed(2); 
            
            const updatedUser = await userService.addSaldo(id, saldoFormatado);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await userService.deleteUser(id);
            res.status(200).json({ mensagem: 'Usuário deletado com sucesso!' });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    async getDashboard(req, res) {
        try {
            // como n tem token, pega o id por query params na url (?userId=1)
            const { userId } = req.query; 
            
            if (!userId) {
                throw new Error('ID do usuário não fornecido na URL.');
            }

            const stats = await userService.getDashboard(userId);
            res.status(200).json(stats);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = new UserController();