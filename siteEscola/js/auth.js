// Simulação simples de login
function login(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Usuários exemplo
  // docente: email termina com @docente.com
  // aluno: email termina com @aluno.com

  if (!email.endsWith("@docente.com") && !email.endsWith("@aluno.com")) {
    alert("Email inválido. Use @docente.com ou @aluno.com");
    return;
  }

  // Salvar usuário no localStorage
  const user = {
    email,
    role: email.endsWith("@docente.com") ? "docente" : "aluno",
    nome: email.split("@")[0] // nome fictício do usuário
  };
  localStorage.setItem("user", JSON.stringify(user));

  // Redireciona para dashboard
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}