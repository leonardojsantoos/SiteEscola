const API_URL = "http://localhost:5279/api";
window.LIMITE_FALTAS = 25;

let instGrafico = null;
let turmas = [];
let usuarios = [];
let materias = [];
let notas = [];

let turmaAtual = null;
let alunoAtual = null;

// ==========================================
// INICIALIZAÇÃO ÚNICA DA PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Guard-rail de sessão
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // 1. Ajusta o visual e permissões primeiro
    configurarVisaoDashboard(user);

    // 2. Busca dados da API
    await carregarDados();

    // 3. Preenche as turmas e seletores
    carregarTurmas(user);
});

// ==========================================
// REQUISIÇÕES API
// ==========================================
async function carregarDados() {
    try {
        const [turmasRes, usuariosRes, materiasRes, notasRes] = await Promise.all([
            fetch(`${API_URL}/Turmas`),
            fetch(`${API_URL}/Usuarios`),
            fetch(`${API_URL}/Materias`),
            fetch(`${API_URL}/Notas`)
        ]);

        turmas = await turmasRes.json();
        usuarios = await usuariosRes.json();
        materias = await materiasRes.json();
        notas = await notasRes.json();

    } catch (erro) {
        console.error("Erro ao carregar dados do servidor:", erro);
    }
}

// ==========================================
// REGRAS DE TEMA E EXIBIÇÃO DA INTERFACE
// ==========================================
function configurarVisaoDashboard(user) {
    const painelProf = document.getElementById("painel-professor");
    const painelGestao = document.getElementById("painel-gestao");
    const titulo = document.getElementById("titulo");
    const gridMain = document.querySelector(".grid-main");

    const role = (user.role || "").toLowerCase();
    const isProfessor = (role === "professor" || role === "docente" || role === "admin");

    if (isProfessor) {
        // VISÃO PROFESSOR
        if (painelProf) painelProf.style.display = "block";
        if (painelGestao) painelGestao.style.display = "block";
        if (titulo) titulo.innerText = `Painel do Professor - ${user.nome || ''}`;
        
        if (gridMain) {
            gridMain.style.display = "grid";
            gridMain.style.gridTemplateColumns = "repeat(auto-fit, minmax(320px, 1fr))";
        }
    } else {
        // VISÃO ALUNO (Usa style.display = 'none' ao invés de .remove() para não quebrar reinstâncias)
        if (painelProf) painelProf.style.display = "none";
        if (painelGestao) painelGestao.style.display = "none";
        if (titulo) titulo.innerText = `Meu Boletim - ${user.nome || ''}`;

        // Oculta o seletor de aluno específico se existir no topo
        const selectAluno = document.getElementById("alunoSelect");
        if (selectAluno && selectAluno.parentElement) {
            selectAluno.parentElement.style.display = "none";
        }

        if (gridMain) {
            gridMain.style.display = "block";
        }
    }
}

// ==========================================
// PREENCHIMENTO DOS SELETORES E TABELAS
// ==========================================
function carregarTurmas(user) {
    const select = document.getElementById("turmaSelect");
    if (!select) return;

    let lista = turmas;
    const role = (user.role || "").toLowerCase();

    // Se for aluno, mostra apenas a turma dele
    if (role === "aluno") {
        lista = turmas.filter(t => t.id === user.turmaId);
    }

    if (lista.length === 0) {
        select.innerHTML = `<option value="">Nenhuma turma disponível</option>`;
        return;
    }

    select.innerHTML = lista.map(t =>
        `<option value="${t.id}">${t.nome}</option>`
    ).join("");

    atualizarSeletores();
}

function atualizarSeletores() {
    const selectTurma = document.getElementById("turmaSelect");
    if (!selectTurma) return;

    const turmaId = Number(selectTurma.value);
    turmaAtual = turmas.find(t => t.id === turmaId);

    if (!turmaAtual) return;

    carregarAlunos();
    carregarMaterias();
    renderBoletim();
}

function carregarAlunos() {
    const select = document.getElementById("alunoSelect");
    if (!select || !turmaAtual) return;

    const alunos = usuarios.filter(u =>
        (u.role || "").toLowerCase() === "aluno" &&
        u.turmaId === turmaAtual.id
    );

    select.innerHTML = alunos.map(a =>
        `<option value="${a.id}">${a.nome}</option>`
    ).join("");
}

function carregarMaterias() {
    const select = document.getElementById("materiaSelect");
    if (!select || !turmaAtual) return;

    const lista = materias.filter(m => m.turmaId === turmaAtual.id);

    select.innerHTML = lista.map(m =>
        `<option value="${m.id}">${m.nome}</option>`
    ).join("");
}

function renderBoletim() {
    const tbody = document.getElementById("boletimBody"); 
    if (!tbody || !turmaAtual) return;

    const alunosDaTurma = usuarios.filter(u => 
        (u.role || "").toLowerCase() === "aluno" && 
        u.turmaId === turmaAtual.id
    );

    if (alunosDaTurma.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3">Nenhum aluno encontrado nesta turma.</td></tr>`;
        return;
    }

    tbody.innerHTML = alunosDaTurma.map(aluno => {
        const notasDoAluno = notas.filter(n => n.alunoId === aluno.id || n.aluno?.id === aluno.id);
        
        const soma = notasDoAluno.reduce((acc, n) => acc + (n.valor || 0), 0);
        const media = notasDoAluno.length > 0 ? (soma / notasDoAluno.length).toFixed(1) : "Sem notas";

        const ehAprovado = media !== "Sem notas" && parseFloat(media) >= 6;

        return `
            <tr>
                <td>${aluno.nome}</td>
                <td>${media}</td>
                <td>
                    <span class="badge ${ehAprovado ? 'bg-success' : 'bg-danger'}">
                        ${media === "Sem notas" ? 'Pendente' : (ehAprovado ? 'Aprovado' : 'Em Risco')}
                    </span>
                </td>
            </tr>
        `;
    }).join("");
}

// ==========================================
// EVENTOS E LOGOUT
// ==========================================
document.getElementById("turmaSelect")?.addEventListener("change", () => {
    atualizarSeletores();
});

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("role_temp");
    window.location.href = "index.html";
}