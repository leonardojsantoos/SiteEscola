const user = JSON.parse(localStorage.getItem("user"));
if (!user) location.href = "login.html";

document.getElementById("titulo").textContent = `Painel ${user.role === 'docente' ? 'do Professor' : 'do Aluno'} - ${user.nome}`;

if (user.role === "aluno") {
  const painel = document.getElementById("painel-professor");
  if (painel) painel.style.display = "none";
}

// --- FUNÇÕES DE GERENCIAMENTO ---

function criarTurma() {
  try {
    const input = document.getElementById("nomeTurma");
    if (!input) throw new Error("Campo 'nomeTurma' não encontrado no HTML");

    const nome = input.value.trim();
    
    if (!nome) {
      alert("Por favor, digite o nome da turma!");
      return;
    }

    // Chama o DB e captura o código gerado
    const codigo = DB.criarTurma(nome);
    
    input.value = ""; 
    alert(`Turma "${nome}" criada com sucesso!\nCódigo de acesso: ${codigo}`);
    
    carregarTurmas(); // Recarrega a lista no select
  } catch (err) {
    console.error("Erro ao criar turma:", err);
    alert("Erro técnico ao criar turma. Verifique o console.");
  }
}

function carregarTurmas() {
  const select = document.getElementById("turmaSelect");
  if (!select) return;

  const turmas = DB.getTurmas();
  select.innerHTML = "";

  if (turmas.length === 0) {
    const opt = document.createElement("option");
    opt.textContent = "-- Nenhuma Turma Criada --";
    select.appendChild(opt);
    return;
  }

  turmas.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.nome;
    opt.textContent = t.nome;
    select.appendChild(opt);
  });

  atualizarSeletores();
}

function atualizarSeletores() {
  const turmaNome = document.getElementById("turmaSelect").value;
  const turma = DB.getTurma(turmaNome);
  const alunoSelect = document.getElementById("alunoSelect");
  const materiaSelect = document.getElementById("materiaSelect");
  const campoCodigo = document.getElementById("exibirCodigoTurma");

  // 1. Mostrar o código apenas para o professor
  if (campoCodigo) {
    if (user.role === "docente" && turma) {
      campoCodigo.innerHTML = `CÓDIGO DE ACESSO: <span style="color: #fff; background: rgba(108, 92, 231, 0.3); padding: 2px 8px; border-radius: 4px;">${turma.codigo}</span>`;
    } else {
      campoCodigo.innerHTML = ""; // Esconde se for aluno ou se não houver turma
    }
  }

  if (!alunoSelect || !materiaSelect) return;

  alunoSelect.innerHTML = "";
  materiaSelect.innerHTML = "";

  if (turma) {
    turma.alunos.forEach(a => {
      const opt = document.createElement("option");
      opt.value = a.nome;
      opt.textContent = a.nome;
      alunoSelect.appendChild(opt);
    });
    turma.materias.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      materiaSelect.appendChild(opt);
    });
  }
  render();
}

// --- RENDERIZAÇÃO DA TABELA (EXCEL STYLE) ---

function render() {
  const turmaNome = document.getElementById("turmaSelect").value;
  const turma = DB.getTurma(turmaNome);
  const tbody = document.getElementById("boletim-corpo");
  if (!tbody) return;
  
  tbody.innerHTML = "";
  if (!turma) return;

  turma.alunos.forEach(aluno => {
    if (user.role === "aluno" && aluno.nome !== user.nome) return;

    // Linha do Nome do Aluno
    const trNome = document.createElement("tr");
    trNome.innerHTML = `<td colspan="8" style="background:#1e2126; font-weight:bold; color:#6C5CE7; border-left:4px solid #6C5CE7;">${aluno.nome.toUpperCase()}</td>`;
    tbody.appendChild(trNome);

    Object.keys(aluno.notas).forEach(materia => {
      const n = aluno.notas[materia];
      const media = (Number(n.b1) + Number(n.b2) + Number(n.b3) + Number(n.b4)) / 4;
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding-left:25px;">${materia}</td>
        <td align="center">${n.b1}</td>
        <td align="center">${n.b2}</td>
        <td align="center">${n.b3}</td>
        <td align="center">${n.b4}</td>
        <td align="center">${n.faltas || 0}</td>
        <td align="center" style="font-weight:bold; color:${media >= 6 ? '#00d084' : '#ff4d4d'}">${media.toFixed(1)}</td>
        <td align="center" style="font-size:10px; font-weight:bold; color:${media >= 6 ? '#00d084' : '#ff4d4d'}">${media >= 6 ? 'APROVADO' : 'REPROVADO'}</td>
      `;
      tbody.appendChild(tr);
    });
  });
}

function logout() {
  // Remove o usuário do navegador
  localStorage.removeItem("user");
  
  // Limpa qualquer papel temporário usado no tema
  localStorage.removeItem("role_temp");
  
  // Redireciona para a página inicial ou de login
  window.location.href = "index.html"; 
}

// Outras funções (addMateria, addAluno, salvarNotas, logout) permanecem como enviamos antes.

carregarTurmas();