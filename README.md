# Meu Instrutor — Back-end API

API RESTful desenvolvida em **Node.js + Express** integrada ao banco de dados relacional **PostgreSQL**, responsável pelo gerenciamento de usuários do ecossistema **Meu Instrutor** (plataforma que conecta candidatos à CNH com instrutores credenciados pelo DETRAN em Florianópolis).

---

## 🛠️ Tecnologias Utilizadas

* **Node.js** & **Express** — Servidor HTTP e roteamento RESTful
* **PostgreSQL** (`pg` / `node-postgres`) — Persistência de dados relacionais
* **Dotenv** — Gerenciamento de variáveis de ambiente
* **CORS** — Liberação de acesso para aplicações cliente (Front-end / Mobile)

---

## 📁 Estrutura do Projeto

```text
backend-meuinstrutor/
├── src/
│   ├── config/
│   │   └── db.js                 # Pool de conexão com o PostgreSQL
│   ├── repositories/
│   │   └── usuarioRepository.js  # Queries SQL parametrizadas (CRUD)
│   ├── routes/
│   │   └── usuarioRoutes.js      # Endpoints HTTP (/usuarios)
│   └── server.js                 # Configuração e inicialização do Express[cite: 5]
├── .env                          # Credenciais locais (ignorado pelo Git)[cite: 5]
├── .gitignore
├── package.json
└── README.md