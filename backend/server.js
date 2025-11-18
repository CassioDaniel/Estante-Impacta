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
  const { titulo, autor } = req.body;

  if (!titulo || !autor) {
    return res.status(400).json({ error: "Título e autor são obrigatórios" });
  }

  db.query(
    "INSERT INTO livros (titulo, autor) VALUES (?, ?)",
    [titulo, autor],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ id: result.insertId, titulo, autor });
    }
  );
});

// Listar todos os livros
app.get("/livros", (req, res) => {
  db.query("SELECT * FROM livros", (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

// Excluir livro pelo ID
app.delete("/livros/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM livros WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao excluir livro" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    res.status(200).json({ message: "Livro excluído com sucesso!" });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// Atualizar livro pelo ID
app.put("/livros/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, autor } = req.body;

  if (!titulo || !autor) {
    return res.status(400).json({ error: "Título e autor são obrigatórios" });
  }

  const query = "UPDATE livros SET titulo = ?, autor = ? WHERE id = ?";
  db.query(query, [titulo, autor, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar livro" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    res.status(200).json({ message: "Livro atualizado com sucesso!" });
  });
});

// Alternar status de lido
app.put("/livros/:id/lido", (req, res) => {
  const { id } = req.params;

  // Alterna lido (1 → 0, 0 → 1)
  db.query(
    "UPDATE livros SET lido = NOT lido WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) return res.status(404).json({ error: "Livro não encontrado" });
      res.json({ message: "Status 'lido' atualizado" });
    }
  );
});
