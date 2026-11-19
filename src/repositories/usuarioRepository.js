const pool = require('../config/db');

const usuarioFields = `
  id,
  nome,
  email,
  telefone,
  tipo_usuario,
  ativo,
  criado_em
`;

async function criar({ nome, email, senha_hash, telefone, tipo_usuario }) {
  const query = `
    INSERT INTO usuarios (nome, email, senha_hash, telefone, tipo_usuario)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING ${usuarioFields}
  `;
  const { rows } = await pool.query(query, [
    nome,
    email,
    senha_hash,
    telefone ?? null,
    tipo_usuario
  ]);
  return rows[0];
}

async function listarTodos() {
  const query = `
    SELECT ${usuarioFields}
    FROM usuarios
    ORDER BY criado_em DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function buscarPorId(id) {
  const query = `
    SELECT ${usuarioFields}
    FROM usuarios
    WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function atualizar(id, { nome, telefone, ativo }) {
  const query = `
    UPDATE usuarios
    SET nome = COALESCE($2, nome),
        telefone = COALESCE($3, telefone),
        ativo = COALESCE($4, ativo)
    WHERE id = $1
    RETURNING ${usuarioFields}
  `;
  const { rows } = await pool.query(query, [
    id,
    nome ?? null,
    telefone ?? null,
    ativo ?? null
  ]);
  return rows[0] || null;
}

async function excluir(id) {
  const query = `
    DELETE FROM usuarios
    WHERE id = $1
    RETURNING id
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

module.exports = {
  criar,
  listarTodos,
  buscarPorId,
  atualizar,
  excluir
};
