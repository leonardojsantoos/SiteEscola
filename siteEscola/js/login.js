document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");
  const criar = document.getElementById("criarConta");

  // Redirecionamento para a página de cadastro
  if (criar) {
    criar.addEventListener("click", () => {
      location.href = "cadastro.html";
    });
  }

  // Lógica de submissão do formulário
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();

      // Busca o usuário no banco de dados (DB vindo do db.js)
      const user = DB.getUsuarios().find(u =>
        u.email === email && u.senha === senha
      );

      if (!user) {
        alert("Email ou senha incorretos!");
        return;
      }

      // Salva o usuário logado na sessão do navegador
      localStorage.setItem("user", JSON.stringify(user));

      // Redireciona para o painel principal
      location.href = "dashboard.html";
    });
  }
});