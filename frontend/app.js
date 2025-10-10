const form = document.querySelector("#stand-form");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const list = document.querySelector("#stand-virtual");
const template = document.querySelector("#book-template");

// Função para carregar livros do banco
async function carregarLivros() {
  const res = await fetch("http://localhost:3000/livros");
  const livros = await res.json();

  // Remove apenas os itens renderizados, não o template
  list.querySelectorAll(".stand").forEach(el => el.remove());

  livros.forEach(livro => {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".book-titulo").textContent = livro.titulo;
    clone.querySelector(".book-autor").textContent = livro.autor;

    // Botão excluir
    const deleteBtn = clone.querySelector(".remove-stand");
    deleteBtn.addEventListener("click", async () => {
      try {
        const response = await fetch(`http://localhost:3000/livros/${livro.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          carregarLivros();
        } else {
          console.error("Erro ao excluir livro");
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    });

    list.appendChild(clone);
  });
}

// Adicionar novo livro
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = titleInput.value.trim();
  const autor = authorInput.value.trim();

  if (!titulo || !autor) return;

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
});

// Carregar ao abrir a página
carregarLivros();
