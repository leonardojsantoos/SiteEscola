const tipo = localStorage.getItem("tipo");

if (tipo === "professor") {
  document.body.classList.add("professor");
} else {
  document.body.classList.add("aluno");
}

function cadastro(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.toLowerCase();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const extra = document.getElementById("extra").value;

  if (tipo === "professor") {

    if (extra !== "PROF123") {
      alert("Código de professor inválido");
      return;
    }

    DB.addUsuario({ nome, email, senha, role: "docente" });

  } else {

    const turma = DB.getTurmaPorCodigo(extra);

    if (!turma) {
      alert("Código da turma inválido");
      return;
    }

    DB.addUsuario({
      nome,
      email,
      senha,
      role: "aluno",
      turma: turma.nome
    });

    const notas = {};
    turma.materias.forEach(m => {
      notas[m] = { b1: 0, b2: 0, b3: 0, b4: 0 };
    });

    turma.alunos.push({
      nome,
      notas,
      faltas: 0
    });

  }

  alert("Conta criada!");
  window.location.href = "login.html";
}

function login(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;

  const user = DB.getUsuarios().find(
    u => u.email === email && u.senha === senha
  );

  if (!user) {
    alert("Login inválido");
    return;
  }

  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "dashboard.html";
}

function irCadastro() {
  window.location.href = "cadastro.html";
}