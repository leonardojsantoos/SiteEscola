// login.js

// Função para redirecionar ao cadastro
function irCadastro() {
  window.location.href = "cadastro.html";
}

// Vincula o click do "Criar conta"
document.getElementById("criarConta").addEventListener("click", irCadastro);

// Formulário de login
const form = document.getElementById("formLogin");
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  // Pega usuários cadastrados
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const user = usuarios.find(u => u.email === email && u.senha === senha);

  if (!user) {
    alert("Email ou senha inválidos!");
    return;
  }

  // Salva usuário logado
  localStorage.setItem("usuarioLogado", JSON.stringify(user));

  // Redireciona para dashboard
  window.location.href = "dashboard.html";
});