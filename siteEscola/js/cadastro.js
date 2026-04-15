document.addEventListener("DOMContentLoaded", () => {
  const roleTemp = localStorage.getItem("role_temp");
  const areaTurma = document.getElementById("area-turma");
  const inputCodigo = document.getElementById("codigoTurma");
  const formCadastro = document.getElementById("formCadastro");

  // Esconde o campo de código se for Professor
  if (roleTemp === "professor" || roleTemp === "docente") {
    if (areaTurma) areaTurma.style.display = "none";
    if (inputCodigo) inputCodigo.removeAttribute("required");
  }

  if (formCadastro) {
    formCadastro.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();
      const codigo = inputCodigo ? inputCodigo.value.trim().toUpperCase() : "";

      // Verifica se já existe um usuário com esse email
      const usuarios = DB.getUsuarios();
      if (usuarios.find(u => u.email === email)) {
        alert("Este email já está cadastrado!");
        return;
      }

      if (roleTemp === "professor" || roleTemp === "docente") {
        // CADASTRO DOCENTE (PROFESSOR)
        DB.addUsuario({ 
          nome, 
          email, 
          senha, 
          role: "docente" 
        });
      } else {
        // CADASTRO ALUNO COM VÍNCULO AUTOMÁTICO
        const turma = DB.getTurmaPorCodigo(codigo);

        if (!turma) {
          alert("Código da turma inválido! Peça o código ao seu professor.");
          return;
        }

        // 1. Cria a conta do usuário aluno (para o Login)
        DB.addUsuario({
          nome,
          email,
          senha,
          role: "aluno",
          turma: turma.nome
        });

        // 2. MATRÍCULA AUTOMÁTICA (Para o Dashboard)
        // Adiciona o aluno diretamente na lista de membros da turma
        // Assim, ele aparece no select do professor imediatamente
        DB.addAluno(turma.nome, nome);
      }

      alert("Conta criada com sucesso! Redirecionando para o login...");
      window.location.href = "login.html";
    });
  }
});