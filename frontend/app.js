const form = document.querySelector("#stand-form");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const list = document.querySelector("#stand-virtual");
const template = document.querySelector("#book-template");

let editandoLivroId = null; // controla se está editando algum livro

// Função para carregar livros do banco
async function carregarLivros() {
  const res = await fetch("http://localhost:3000/livros");
  const livros = await res.json();

  // Limpa os livros exibidos
  list.querySelectorAll(".stand").forEach(el => el.remove());

  livros.forEach(livro => {
    const clone = template.content.cloneNode(true);
    const tituloEl = clone.querySelector(".book-titulo");
    const autorEl = clone.querySelector(".book-autor");
    const deleteBtn = clone.querySelector(".remove-stand");
    const editBtn = clone.querySelector(".edit-stand");

    tituloEl.textContent = livro.titulo;
    autorEl.textContent = livro.autor;

    // Excluir
    deleteBtn.addEventListener("click", async () => {
      try {
        const response = await fetch(`http://localhost:3000/livros/${livro.id}`, {
          method: "DELETE",
        });
        if (response.ok) carregarLivros();
      } catch (error) {
        console.error("Erro:", error);
      }
    });

    // Editar → carrega o nome e autor nos inputs superiores
    editBtn.addEventListener("click", () => {
      titleInput.value = livro.titulo;
      authorInput.value = livro.autor;
      editandoLivroId = livro.id; // guarda o ID que está sendo editado

      // muda o ícone do botão pra indicar edição
      form.querySelector("button i").classList.remove("fa-plus");
      form.querySelector("button i").classList.add("fa-save");
    });

    list.appendChild(clone);
  });
}

// Adicionar OU Editar livro
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = titleInput.value.trim();
  const autor = authorInput.value.trim();
  if (!titulo || !autor) return;

  // Se estiver editando um livro existente
  if (editandoLivroId) {
    const res = await fetch(`http://localhost:3000/livros/${editandoLivroId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, autor })
    });

    if (res.ok) {
      editandoLivroId = null; // sai do modo edição
      form.querySelector("button i").classList.remove("fa-save");
      form.querySelector("button i").classList.add("fa-plus");
      titleInput.value = "";
      authorInput.value = "";
      carregarLivros();
    } else {
      console.error("Erro ao editar livro");
    }

  } else {
    // Caso contrário: adiciona um novo
    const res = await fetch("http://localhost:3000/livros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, autor })
    });

    if (res.ok) {
      titleInput.value = "";
      authorInput.value = "";
      carregarLivros();
    } else {
      console.error("Erro ao adicionar livro");
    }
  }
});

// Carregar ao abrir a página
carregarLivros();
