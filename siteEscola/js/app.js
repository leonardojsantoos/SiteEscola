const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "index.html"; // Redireciona se não logado
}

const titulo = document.getElementById("titulo");
const painelProfessor = document.getElementById("painel-professor");
const tabelaBody = document.querySelector("#tabela tbody");
const containerPrincipal = document.getElementById("container-principal");
const boletimContainer = document.getElementById("boletim-container");

titulo.textContent = `Bem-vindo, ${user.nome} (${user.role})`;

// Ajusta layout e visibilidade conforme papel
if (user.role === "docente") {
  painelProfessor.style.display = "block";
  containerPrincipal.classList.add("grid");  // Ativa grid com painel lateral
  boletimContainer.classList.remove("aluno-container"); // Remove centralização p/ professor
} else {
  painelProfessor.style.display = "none";
  containerPrincipal.classList.remove("grid"); // Remove grid para aluno
  boletimContainer.classList.add("aluno-container"); // Centraliza boletim para aluno
}

// Renderiza tabela com notas, faltas, média e status
function renderTabela() {
  tabelaBody.innerHTML = "";

  let alunos = DB.getAlunos();

  if (user.role === "aluno") {
    alunos = alunos.filter(a => a.nome === user.nome);
  }

  alunos.forEach(aluno => {
    const media = (aluno.b1 + aluno.b2 + aluno.b3 + aluno.b4) / 4;
    const status = media >= 7 ? "Aprovado" : "Reprovado";

    const linha = document.createElement("tr");

    // Nome aluno
    const tdNome = document.createElement("td");
    tdNome.textContent = aluno.nome;
    linha.appendChild(tdNome);

    // Notas e faltas: inputs se professor, texto se aluno
    ["b1", "b2", "b3", "b4", "faltas"].forEach(campo => {
      const td = document.createElement("td");

      if (user.role === "docente") {
        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = campo === "faltas" ? 100 : 10;
        input.value = aluno[campo];
        input.step = campo === "faltas" ? "1" : "0.1";
        input.addEventListener("change", e => {
          let val = parseFloat(e.target.value);
          if (isNaN(val)) val = 0;
          if (campo !== "faltas") {
            val = Math.min(Math.max(val, 0), 10);
          } else {
            val = Math.max(val, 0);
          }
          e.target.value = val;
          DB.updateAluno(aluno.nome, campo, val);
          renderTabela();
        });
        td.appendChild(input);
      } else {
        td.textContent = aluno[campo];
      }

      linha.appendChild(td);
    });

    // Média anual (somente leitura, em negrito)
    const tdMedia = document.createElement("td");
    tdMedia.textContent = media.toFixed(2);
    tdMedia.style.fontWeight = "bold";
    linha.appendChild(tdMedia);

    // Status colorido
    const tdStatus = document.createElement("td");
    tdStatus.textContent = status;
    tdStatus.className = media >= 7 ? "aprovado" : "reprovado";
    linha.appendChild(tdStatus);

    tabelaBody.appendChild(linha);
  });
}

renderTabela();

function adicionarAluno() {
  const nomeAlunoInput = document.getElementById("nomeAluno");
  const nome = nomeAlunoInput.value.trim().toLowerCase();

  if (!nome) {
    alert("Digite o nome do aluno");
    return;
  }

  if (DB.getAlunos().some(a => a.nome === nome)) {
    alert("Aluno já existe");
    return;
  }

  DB.addAluno(nome);
  nomeAlunoInput.value = "";
  renderTabela();
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}