document.addEventListener("DOMContentLoaded", async () => {
  // Puxa os dados da internet antes de verificar o login
  await DB.carregarDados();

  const form = document.getElementById("formLogin");
  const criar = document.getElementById("criarConta");

  if (criar) {
    criar.addEventListener("click", () => {
      location.href = "cadastro.html";
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();

      // Agora a lista de usuários estará preenchida com os dados da nuvem
      const user = DB.getUsuarios().find(u =>
        u.email === email && u.senha === senha
      );

      if (!user) {
        alert("Email ou senha incorretos!");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      location.href = "dashboard.html";
    });
  }
});