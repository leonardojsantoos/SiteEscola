document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("formCadastro").addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const codigo = document.getElementById("codigoTurma").value.trim();

    let user;

    if (codigo) {

      const turma = DB.getTurmaPorCodigo(codigo);

      if (!turma) {
        alert("Código da turma inválido");
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

    } else {
      user = {
        nome,
        email,
        senha,
        role: "docente"
      };
    }

    DB.addUsuario(user);

    alert("Cadastro realizado!");
    location.href = "login.html";
  });

});

function irLogin() {
  location.href = "login.html";
}