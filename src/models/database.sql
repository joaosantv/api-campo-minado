
-- tabela usuarios

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    saldo DECIMAL(10, 2) DEFAULT 0.00
);

-- tabela jogos 

CREATE TABLE jogos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    valor_aposta DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'EM_ANDAMENTO',
    diamantes_encontrados INT DEFAULT 0,
    tabuleiro JSON NOT NULL,
    CONSTRAINT fk_usuario
      FOREIGN KEY(usuario_id) 
	  REFERENCES usuarios(id)
	  ON DELETE CASCADE
);