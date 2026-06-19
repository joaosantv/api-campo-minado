class User {
    constructor(id, nome, email, dataNascimento, senha, saldo = 0) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.dataNascimento = dataNascimento;
        this.senha = senha;
        this.saldo = saldo;
    }
}

module.exports = User;