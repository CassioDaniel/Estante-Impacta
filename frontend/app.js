const form = document.querySelector("#stand-form");
const input = document.querySelector("#stand-input");
const list = document.querySelector("#stand-virtual");
const template = document.querySelector("#livro-template");

// Função para carregar livros do banco
async function carregarLivros() {
  const res = await fetch("http://localhost:3000/livros");
  const livros = await res.json();

  list.innerHTML = ""; // limpa a lista antes de renderizar

  livros.forEach(livro => {
    const clone = template.content.cloneNode(true); // clona o modelo
    clone.querySelector("h3").textContent = livro.titulo;
    list.appendChild(clone);
  });
}

// Adicionar novo livro
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = input.value.trim();

  if (!titulo) return;

  await fetch("http://localhost:3000/livros", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo })
  });

  input.value = "";
  carregarLivros();
});

// Carregar ao abrir a página
carregarLivros();
