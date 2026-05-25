document.addEventListener("DOMContentLoaded", async () => {
  // Baixa os dados primeiro
  await DB.carregarDados();

  const roleTemp = localStorage.getItem("role_temp");
  const areaTurma = document.getElementById("area-turma");
  const inputCodigo = document.getElementById("codigoTurma");
  const formCadastro = document.getElementById("formCadastro");

  if (roleTemp === "professor" || roleTemp === "docente") {
    if (areaTurma) areaTurma.style.display = "none";
    if (inputCodigo) inputCodigo.removeAttribute("required");
  }

  if (formCadastro) {
    // Adicionamos o async aqui
    formCadastro.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();
      const codigo = inputCodigo ? inputCodigo.value.trim().toUpperCase() : "";

      const usuarios = DB.getUsuarios();
      if (usuarios.find(u => u.email === email)) {
        alert("Este email já está cadastrado!");
        return;
      }

      if (roleTemp === "professor" || roleTemp === "docente") {
        // Colocamos await para salvar na internet
        await DB.addUsuario({ nome, email, senha, role: "docente" });
      } else {
        const turma = DB.getTurmaPorCodigo(codigo);
        if (!turma) {
          alert("Código da turma inválido! Peça o código ao seu professor.");
          return;
        }

        // Colocamos await nos cadastros
        await DB.addUsuario({ nome, email, senha, role: "aluno", turma: turma.nome });
        await DB.addAluno(turma.nome, nome);
      }

      alert("Conta criada com sucesso! Redirecionando para o login...");
      window.location.href = "login.html";
    });
  }
});