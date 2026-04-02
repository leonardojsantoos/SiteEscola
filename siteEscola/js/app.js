const user = JSON.parse(localStorage.getItem("user"));
if (!user) location.href = "login.html";

const turmaSelect = document.getElementById("turmaSelect");
const tabelaBody = document.querySelector("#tabela tbody");
const painelProfessor = document.getElementById("painel-professor");

document.getElementById("titulo").textContent =
  `Bem-vindo, ${user.nome}`;

if (user.role !== "docente") {
  painelProfessor.style.display = "none";
}

function carregarTurmas() {
  turmaSelect.innerHTML = "";

  DB.getTurmas().forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.nome;
    opt.textContent = t.nome;
    turmaSelect.appendChild(opt);
  });

  carregarTurma();
}

function carregarTurma() {
  const nome = turmaSelect.value;
  const turma = DB.getTurma(nome);

  tabelaBody.innerHTML = "";

  turma.alunos.forEach(aluno => {

    if (user.role === "aluno" && aluno.nome !== user.nome) return;

    Object.keys(aluno.notas).forEach(materia => {

      const notas = aluno.notas[materia];
      const media = (notas.b1 + notas.b2 + notas.b3 + notas.b4) / 4;
      const status = media >= 6 ? "Aprovado" : "Reprovado";

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${aluno.nome}</td>
        <td>${materia}</td>

        ${["b1","b2","b3","b4"].map(b => `
          <td>
            ${
              user.role === "docente"
              ? `<input type="number" value="${notas[b]}" 
                 onchange="editarNota('${nome}','${aluno.nome}','${materia}','${b}', this.value)">`
              : notas[b]
            }
          </td>
        `).join("")}

        <td><strong>${media.toFixed(2)}</strong></td>
        <td class="${media >= 6 ? 'aprovado' : 'reprovado'}">${status}</td>
      `;

      tabelaBody.appendChild(tr);
    });

  });
}

function criarTurma() {
  const nome = document.getElementById("nomeTurma").value;
  const codigo = DB.criarTurma(nome);
  alert("Código da turma: " + codigo);
  carregarTurmas();
}

function addMateria() {
  const nome = turmaSelect.value;
  const materia = document.getElementById("nomeMateria").value;
  DB.addMateria(nome, materia);
  carregarTurma();
}

function addAluno() {
  const nomeTurma = turmaSelect.value;
  const aluno = document.getElementById("nomeAluno").value.toLowerCase();
  DB.addAluno(nomeTurma, aluno);
  carregarTurma();
}

function editarNota(turma, aluno, materia, campo, valor) {
  valor = parseFloat(valor) || 0;
  valor = Math.min(Math.max(valor, 0), 10);

  DB.updateNota(turma, aluno, materia, campo, valor);
  carregarTurma();
}

function logout() {
  localStorage.removeItem("user");
  location.href = "login.html";
}

carregarTurmas();