const user = JSON.parse(localStorage.getItem("user"));
if (!user) location.href = "login.html";

const LIMITE_FALTAS = 25;

document.addEventListener("DOMContentLoaded", () => {
    // Define o título do painel (Professor ou Aluno)
    const titulo = document.getElementById("titulo");
    if (titulo) {
        titulo.textContent = `Painel ${user.role === 'docente' ? 'do Professor' : 'do Aluno'} - ${user.nome}`;
    }
    
    // Restrição de interface: Remove painéis de gestão se for Aluno
    if (user.role === "aluno") {
        document.getElementById("painel-professor")?.remove();
        document.getElementById("painel-gestao")?.remove();
        document.getElementById("exibirCodigoTurma")?.remove();
        
        // No dashboard do aluno, o seletor de turma fica desativado ou escondido
        const select = document.getElementById("turmaSelect");
        if(select) select.disabled = true;
    }

    carregarTurmas();
});

function carregarTurmas() {
    const select = document.getElementById("turmaSelect");
    if (!select) return;

    const turmas = DB.getTurmas();
    
    // Aluno só vê a própria turma (vinculada no cadastro), Professor vê todas
    const turmasFiltradas = user.role === "aluno" 
        ? turmas.filter(t => t.nome === user.turma) 
        : turmas;

    select.innerHTML = turmasFiltradas.length 
        ? turmasFiltradas.map(t => `<option value="${t.nome}">${t.nome}</option>`).join("")
        : '<option value="">Nenhuma turma encontrada</option>';

    atualizarSeletores();
}

function atualizarSeletores() {
    const selectTurma = document.getElementById("turmaSelect");
    if (!selectTurma) return;

    const turmaNome = selectTurma.value;
    const turma = DB.getTurma(turmaNome);
    if (!turma) return;

    // Interface do Professor
    if (user.role === 'docente') {
        const badge = document.getElementById("exibirCodigoTurma");
        if (badge) badge.textContent = `CÓDIGO: ${turma.codigo}`;

        const alunoSel = document.getElementById("alunoSelect");
        const materiaSel = document.getElementById("materiaSelect");

        if (alunoSel) {
            // Aqui aparecem os alunos que se cadastraram com o código da turma
            alunoSel.innerHTML = turma.alunos.length 
                ? turma.alunos.map(a => `<option value="${a.nome}">${a.nome}</option>`).join("")
                : '<option value="">Sem alunos cadastrados</option>';
            
            alunoSel.onchange = renderBoletim;
        }

        if (materiaSel) {
            materiaSel.innerHTML = turma.materias.length
                ? turma.materias.map(m => `<option value="${m}">${m}</option>`).join("")
                : '<option value="">Sem matérias</option>';
        }
    }

    renderBoletim();
}

function salvarNotas() {
    const turma = document.getElementById("turmaSelect")?.value;
    const aluno = document.getElementById("alunoSelect")?.value;
    const materia = document.getElementById("materiaSelect")?.value;

    if (!aluno || !materia || aluno === "Sem alunos cadastrados") {
        return alert("Erro: Selecione um aluno e uma matéria!");
    }

    const dados = {
        b1: document.getElementById("notaB1").value || 0,
        b2: document.getElementById("notaB2").value || 0,
        b3: document.getElementById("notaB3").value || 0,
        b4: document.getElementById("notaB4").value || 0,
        faltas: document.getElementById("faltasInput").value || 0
    };

    // Salva no Banco de Dados
    Object.entries(dados).forEach(([campo, valor]) => {
        DB.updateNota(turma, aluno, materia, campo, valor);
    });

    alert(`Notas de ${aluno} atualizadas com sucesso!`);
    renderBoletim();
    
    // Limpa os campos de input após salvar
    ["notaB1", "notaB2", "notaB3", "notaB4", "faltasInput"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
}

function renderBoletim() {
    const selectTurma = document.getElementById("turmaSelect");
    const tbody = document.getElementById("boletim-corpo");
    if (!selectTurma || !tbody) return;

    const turma = DB.getTurma(selectTurma.value);
    if (!turma) return;

    // Se for aluno, busca os dados dele. Se for professor, busca o aluno selecionado no select.
    const alunoSel = document.getElementById("alunoSelect");
    let nomeParaExibir = user.role === "aluno" ? user.nome : (alunoSel ? alunoSel.value : "");

    tbody.innerHTML = "";
    const aluno = turma.alunos.find(a => a.nome === nomeParaExibir);

    if (aluno) {
        // Cabeçalho com o nome do aluno no boletim
        const trHeader = document.createElement("tr");
        trHeader.innerHTML = `<td colspan="8" style="background:rgba(108, 92, 231, 0.1); font-weight:bold; color:var(--roxo); text-align:left;">👤 ALUNO: ${aluno.nome.toUpperCase()}</td>`;
        tbody.appendChild(trHeader);

        turma.materias.forEach(materia => {
            const n = aluno.notas[materia] || { b1: 0, b2: 0, b3: 0, b4: 0, faltas: 0 };
            const media = (Number(n.b1) + Number(n.b2) + Number(n.b3) + Number(n.b4)) / 4;
            const reprovadoFalta = Number(n.faltas) >= LIMITE_FALTAS;
            const reprovadoNota = media < 6;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="padding-left:30px; text-align:left;">${materia}</td>
                <td align="center">${n.b1}</td>
                <td align="center">${n.b2}</td>
                <td align="center">${n.b3}</td>
                <td align="center">${n.b4}</td>
                <td align="center" style="color:${reprovadoFalta ? '#ff4d4d' : ''}; font-weight:${reprovadoFalta ? 'bold' : 'normal'}">${n.faltas}</td>
                <td align="center" style="font-weight:bold;">${media.toFixed(1)}</td>
                <td align="center" style="font-weight:bold; color:${(reprovadoNota || reprovadoFalta) ? '#ff4d4d' : '#00d084'}">
                    ${(reprovadoNota || reprovadoFalta) ? 'REPROVADO' : 'APROVADO'}
                </td>`;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = "<tr><td colspan='8'>Aguardando seleção de aluno ou matrícula automática.</td></tr>";
    }
}

// --- Funções de Gestão Estrutural ---

function criarTurma() {
    const el = document.getElementById("nomeTurma");
    const nome = el?.value.trim();
    if (nome) {
        const cod = DB.criarTurma(nome); // Gera o código automático no DB
        el.value = "";
        carregarTurmas();
        alert(`Sucesso!\nTurma: ${nome}\nCódigo para Alunos: ${cod}`);
    }
}

function addMateria() {
    const turma = document.getElementById("turmaSelect")?.value;
    const el = document.getElementById("nomeMateria");
    const mat = el?.value.trim();
    if (mat && turma) {
        DB.addMateria(turma, mat);
        el.value = "";
        atualizarSeletores();
        alert(`Matéria ${mat} adicionada à turma!`);
    }
}

// Logout do sistema
function logout() {
    // Limpa os dados da sessão
    localStorage.removeItem("user");
    localStorage.removeItem("role_temp");
    
    // Redireciona para a tela de ESCOLHA (aluno ou professor)
    // Se o seu arquivo se chamar index.html ou escolha.html, mude abaixo:
    location.href = "index.html"; 
}