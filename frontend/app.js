const form = document.querySelector("#stand-form");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const list = document.querySelector("#stand-virtual");
const template = document.querySelector("#book-template");

let editandoLivroId = null; // controla quando está editando

// Carregar livros do banco
async function carregarLivros() {
  const res = await fetch("http://localhost:3000/livros");
  const livros = await res.json();

  // limpa lista na tela
  list.querySelectorAll(".stand").forEach(el => el.remove());

  livros.forEach(livro => {
    const clone = template.content.cloneNode(true);
    const tituloEl = clone.querySelector(".book-titulo");
    const autorEl = clone.querySelector(".book-autor");
    const deleteBtn = clone.querySelector(".remove-stand");
    const editBtn = clone.querySelector(".edit-stand");
    const finishBtn = clone.querySelector(".finish-stand");
    const checkIcon = finishBtn.querySelector("i");
    const standDiv = clone.querySelector(".stand");

    tituloEl.textContent = livro.titulo;
    autorEl.textContent = livro.autor;

    // Visual do botão check e fundo da div
    if (livro.lido) {
      standDiv.classList.add("lido");
      checkIcon.classList.add("check-on");
    } else {
      checkIcon.classList.add("check-off");
    }

    // Toggle: lido x não lido
    finishBtn.addEventListener("click", async () => {
      await fetch(`http://localhost:3000/livros/${livro.id}/lido`, { method: "PUT" });
      carregarLivros();
    });

    // Excluir
    deleteBtn.addEventListener("click", async () => {
      const res = await fetch(`http://localhost:3000/livros/${livro.id}`, { method: "DELETE" });
      if (res.ok) carregarLivros();
    });

    // Editar
    editBtn.addEventListener("click", () => {
      titleInput.value = livro.titulo;
      authorInput.value = livro.autor;
      editandoLivroId = livro.id;

      // troca ícone do botão para salvar
      form.querySelector("button i").classList.remove("fa-plus");
      form.querySelector("button i").classList.add("fa-save");
    });

    list.appendChild(clone);
  });
}

// Adicionar ou editar livro
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = titleInput.value.trim();
  const autor = authorInput.value.trim();
  if (!titulo || !autor) return;

  // Editando
  if (editandoLivroId) {
    const res = await fetch(`http://localhost:3000/livros/${editandoLivroId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, autor })
    });

    if (res.ok) {
      editandoLivroId = null;
      form.querySelector("button i").classList.remove("fa-save");
      form.querySelector("button i").classList.add("fa-plus");
      titleInput.value = "";
      authorInput.value = "";
      carregarLivros();
    }

  } else {
    // Novo livro
    const res = await fetch("http://localhost:3000/livros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, autor })
    });

    if (res.ok) {
      titleInput.value = "";
      authorInput.value = "";
      carregarLivros();
    }
  }
});

// Carregar ao abrir
carregarLivros();
