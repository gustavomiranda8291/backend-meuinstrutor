/*
 * Projeto: API RESTful - Meu Instrutor (N3)
 * Instituição: UNICESUSC - ADS21
 * Integrantes da Equipe:
 * - Emerson Arruda (RA: 2614414)
 * - Gustavo Silveira Miranda (RA: 1820005)
 */

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/usuarios', usuarioRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});