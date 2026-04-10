document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formLogin");
  const criar = document.getElementById("criarConta");

  if (criar) {
    criar.addEventListener("click", () => {
      location.href = "cadastro.html";
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    const user = DB.getUsuarios().find(u =>
      u.email === email && u.senha === senha
    );

    if (!user) {
      alert("Login inválido");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    location.href = "dashboard.html";
  });

});