const form = document.querySelector("#stand-form");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const list = document.querySelector("#stand-virtual");
const template = document.querySelector("#book-template");

// Função para carregar livros do banco
async function carregarLivros() {
  const res = await fetch("http://localhost:3000/livros");
  const livros = await res.json();

  list.innerHTML = ""; // limpa a lista antes de renderizar

  livros.forEach(livro => {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".book-titulo").textContent = livro.titulo;
    clone.querySelector(".book-autor").textContent = livro.autor;
    list.appendChild(clone);
  });
}

// Adicionar novo livro
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = titleInput.value.trim();
  const autor = authorInput.value.trim();

  if (!titulo || !autor) return;

  await fetch("http://localhost:3000/livros", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, autor })
  });

  titleInput.value = "";
  authorInput.value = "";
  carregarLivros();
});

// Carregar ao abrir a página
carregarLivros();
