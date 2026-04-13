document.addEventListener("DOMContentLoaded", () => {
  const roleTemp = localStorage.getItem("role_temp");
  const areaTurma = document.getElementById("area-turma");
  const inputCodigo = document.getElementById("codigoTurma");

  // Se for professor, esconde o campo de turma
  if (roleTemp === "professor" || roleTemp === "docente") {
    if (areaTurma) areaTurma.style.display = "none";
  }

  document.getElementById("formCadastro").addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const codigo = inputCodigo.value.trim();

    let user;

    if (roleTemp === "professor" || roleTemp === "docente") {
      // Cadastro de Professor
      user = {
        nome,
        email,
        senha,
        role: "docente"
      };
    } else {
      // Cadastro de Aluno (exige código)
      const turma = DB.getTurmaPorCodigo(codigo);

      if (!turma) {
        alert("Código da turma inválido!");
        return;
      }

      user = {
        nome,
        email,
        senha,
        role: "aluno",
        turma: turma.nome
      };

      DB.addAluno(turma.nome, nome);
    }

    DB.addUsuario(user);
    alert("Conta criada com sucesso!");
    location.href = "login.html";
  });
});

function irLogin() {
  location.href = "login.html";
}