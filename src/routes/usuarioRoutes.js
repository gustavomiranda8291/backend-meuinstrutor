const express = require('express');
const usuarioRepository = require('../repositories/usuarioRepository');

const router = express.Router();
const tiposUsuario = new Set(['CANDIDATO', 'INSTRUTOR', 'ADMIN']);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validarId(id, res) {
  if (!uuidPattern.test(id)) {
    res.status(400).json({ erro: 'O ID informado deve ser um UUID válido.' });
    return false;
  }
  return true;
}

router.post('/', asyncHandler(async (req, res) => {
  if (!isObject(req.body)) {
    return res.status(400).json({ erro: 'O corpo da requisição deve ser um objeto JSON.' });
  }

  const { nome, email, senha_hash, telefone, tipo_usuario } = req.body;
  if (
    typeof nome !== 'string' || !nome.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof senha_hash !== 'string' || !senha_hash.trim() ||
    (telefone !== undefined && telefone !== null && typeof telefone !== 'string') ||
    !tiposUsuario.has(tipo_usuario)
  ) {
    return res.status(400).json({
      erro: 'Informe nome, email, senha_hash e tipo_usuario válidos. tipo_usuario deve ser CANDIDATO, INSTRUTOR ou ADMIN.'
    });
  }

  const usuario = await usuarioRepository.criar({
    nome: nome.trim(),
    email: email.trim(),
    senha_hash,
    telefone: telefone?.trim() || null,
    tipo_usuario
  });
  return res.status(201).json(usuario);
}));

router.get('/', asyncHandler(async (_req, res) => {
  const usuarios = await usuarioRepository.listarTodos();
  return res.status(200).json(usuarios);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  if (!validarId(req.params.id, res)) return;

  const usuario = await usuarioRepository.buscarPorId(req.params.id);
  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' });
  }
  return res.status(200).json(usuario);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  if (!validarId(req.params.id, res)) return;
  if (!isObject(req.body)) {
    return res.status(400).json({ erro: 'O corpo da requisição deve ser um objeto JSON.' });
  }

  const allowedFields = new Set(['nome', 'telefone', 'ativo']);
  const fields = Object.keys(req.body);
  if (
    fields.length === 0 ||
    fields.some((field) => !allowedFields.has(field)) ||
    (req.body.nome !== undefined && (typeof req.body.nome !== 'string' || !req.body.nome.trim())) ||
    (req.body.telefone !== undefined && typeof req.body.telefone !== 'string') ||
    (req.body.ativo !== undefined && typeof req.body.ativo !== 'boolean')
  ) {
    return res.status(400).json({
      erro: 'Informe ao menos um campo válido para atualizar: nome, telefone e/ou ativo.'
    });
  }

  const usuario = await usuarioRepository.atualizar(req.params.id, {
    nome: req.body.nome?.trim(),
    telefone: req.body.telefone?.trim(),
    ativo: req.body.ativo
  });
  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' });
  }
  return res.status(200).json(usuario);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  if (!validarId(req.params.id, res)) return;

  const usuario = await usuarioRepository.excluir(req.params.id);
  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' });
  }
  return res.status(200).json({
    mensagem: 'Usuário excluído com sucesso.',
    id: usuario.id
  });
}));

module.exports = router;
