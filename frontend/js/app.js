const API_URL = "http://localhost:5279/api";

window.LIMITE_FALTAS = 25;

let instGrafico = null;

let turmas = [];
let usuarios = [];
let materias = [];
let notas = [];

let turmaAtual = null;
let alunoAtual = null;

document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        location.href = "login.html";
        return;
    }

    await carregarDados();

    configurarTela(user);

    carregarTurmas(user);
});


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
        console.error("Erro ao carregar dados:", erro);
    }
}


function configurarTela(user) {
    const titulo = document.getElementById("titulo");

    if (titulo) {
        titulo.textContent =
            `Painel ${user.role} - ${user.nome}`;
    }

    if (user.role === "aluno") {
        document.getElementById("painel-professor")?.remove();
        document.getElementById("painel-gestao")?.remove();
    }
}


function carregarTurmas(user) {
    const select = document.getElementById("turmaSelect");

    if (!select)
        return;


    let lista = turmas;

    if (user.role === "aluno") {
        lista = turmas.filter(t => t.id === user.turmaId);
    }


    select.innerHTML = lista.map(t =>
        `<option value="${t.id}">
            ${t.nome}
        </option>`
    ).join("");


    atualizarSeletores();
}


function atualizarSeletores() {
    const turmaId = Number(
        document.getElementById("turmaSelect").value
    );

    turmaAtual = turmas.find(t => t.id === turmaId);

    if (!turmaAtual)
        return;


    carregarAlunos();
    carregarMaterias();

    renderBoletim();
}


function carregarAlunos() {
    const select = document.getElementById("alunoSelect");

    if (!select)
        return;


    const alunos = usuarios.filter(u =>
        u.role === "aluno" &&
        u.turmaId === turmaAtual.id
    );


    select.innerHTML = alunos.map(a =>
        `<option value="${a.id}">
            ${a.nome}
        </option>`
    ).join("");
}


function carregarMaterias() {
    const select = document.getElementById("materiaSelect");

    if (!select)
        return;


    const lista = materias.filter(m =>
        m.turmaId === turmaAtual.id
    );


    select.innerHTML = lista.map(m =>
        `<option value="${m.id}">
            ${m.nome}
        </option>`
    ).join("");
}