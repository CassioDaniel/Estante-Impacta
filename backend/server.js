const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conexão MySQL
const db = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "cassio",
  password: "root123",
  database: "meubanco"
});

// Inserir livro
app.post("/livros", (req, res) => {
  const { titulo } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: "Título é obrigatório" });
  }

  db.query("INSERT INTO livros (titulo) VALUES (?)", [titulo], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ id: result.insertId, titulo });
  });
});

// rota de Listar todos os livros
app.get("/livros", (req, res) => {
  db.query("SELECT * FROM livros", (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
