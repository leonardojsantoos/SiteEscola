const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  location.href = "login.html";
}

const turmaSelect = document.getElementById("turmaSelect");
const tbody = document.querySelector("tbody");

document.getElementById("titulo").textContent =
  `Bem-vindo, ${user.nome}`;

function carregarTurmas() {
  turmaSelect.innerHTML = "";

  DB.getTurmas().forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.nome;
    opt.textContent = `${t.nome} (${t.codigo})`;
    turmaSelect.appendChild(opt);
  });

  render();
}

function render() {
  const turma = DB.getTurma(turmaSelect.value);
  if (!turma) return;

  tbody.innerHTML = "";

  turma.alunos.forEach(aluno => {

    if (user.role === "aluno" && aluno.nome !== user.nome) return;

    Object.keys(aluno.notas).forEach(materia => {

      const n = aluno.notas[materia];
      const media = (n.b1 + n.b2 + n.b3 + n.b4) / 4;

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${aluno.nome}</td>
        <td>${materia}</td>

        ${["b1","b2","b3","b4"].map(b => `
          <td>
            ${
              user.role === "docente"
              ? `<input type="number" value="${n[b]}"
                onchange="DB.updateNota('${turma.nome}','${aluno.nome}','${materia}','${b}',this.value);render()">`
              : n[b]
            }
          </td>
        `).join("")}

        <td>${media.toFixed(1)}</td>
        <td>${media >= 6 ? "Aprovado" : "Reprovado"}</td>
      `;

      tbody.appendChild(tr);
    });
  });
}

// ações professor
function criarTurma() {
  const nome = document.getElementById("nomeTurma").value;
  const codigo = DB.criarTurma(nome);
  alert("Código: " + codigo);
  carregarTurmas();
}

function addMateria() {
  DB.addMateria(turmaSelect.value, document.getElementById("nomeMateria").value);
  render();
}

function addAluno() {
  DB.addAluno(turmaSelect.value, document.getElementById("nomeAluno").value);
  render();
}

function logout() {
  localStorage.removeItem("user");
  location.href = "login.html";
}

carregarTurmas();