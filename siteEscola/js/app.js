const user = JSON.parse(localStorage.getItem("user"));
if (!user) location.href = "login.html";

const LIMITE_FALTAS = 25;
let instGrafico = null;

document.addEventListener("DOMContentLoaded", () => {
    const titulo = document.getElementById("titulo");
    if (titulo) {
        titulo.textContent = `Painel ${user.role === 'docente' ? 'do Professor' : 'do Aluno'} - ${user.nome}`;
    }

    if (user.role === "aluno") {
        document.getElementById("painel-professor")?.remove();
        document.getElementById("painel-gestao")?.remove();
        document.getElementById("exibirCodigoTurma")?.remove();
        const select = document.getElementById("turmaSelect");
        if (select) select.disabled = true;
    }

    carregarTurmas();
});

function carregarTurmas() {
    const select = document.getElementById("turmaSelect");
    if (!select) return;

    const turmas = DB.getTurmas();
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

    if (user.role === 'docente') {
        const badge = document.getElementById("exibirCodigoTurma");
        if (badge) badge.textContent = `CÓDIGO: ${turma.codigo}`;

        const alunoSel = document.getElementById("alunoSelect");
        const materiaSel = document.getElementById("materiaSelect");

        if (alunoSel) {
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

    Object.entries(dados).forEach(([campo, valor]) => {
        DB.updateNota(turma, aluno, materia, campo, valor);
    });

    alert(`Sucesso! Boletim de ${aluno} atualizado.`);
    renderBoletim();
}

function renderBoletim() {
    const selectTurma = document.getElementById("turmaSelect");
    const tbody = document.getElementById("boletim-corpo");
    if (!selectTurma || !tbody) return;

    const turma = DB.getTurma(selectTurma.value);
    if (!turma) return;

    const alunoSel = document.getElementById("alunoSelect");
    let nomeParaExibir = user.role === "aluno" ? user.nome : (alunoSel ? alunoSel.value : "");

    tbody.innerHTML = "";
    const aluno = turma.alunos.find(a => a.nome === nomeParaExibir);

    if (aluno) {
        const trHeader = document.createElement("tr");
        trHeader.innerHTML = `<td colspan="8" style="background:rgba(108, 92, 231, 0.1); font-weight:bold; color:#6c5ce7; text-align:left; padding: 10px;">👤 ALUNO: ${aluno.nome.toUpperCase()}</td>`;
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

        gerarAnaliseCientifica(aluno);
    } else {
        tbody.innerHTML = "<tr><td colspan='8'>Aguardando seleção de aluno...</td></tr>";
    }
}

function gerarAnaliseCientifica(aluno) {
    const canvas = document.getElementById('graficoCorrelacao');
    const container = document.getElementById('cards-insights');

    if (!canvas || !container) return;

    container.innerHTML = "";
    const labels = Object.keys(aluno.notas);
    if (labels.length === 0) return;

    const dadosMedias = [];
    const dadosFaltas = [];

    labels.forEach(materia => {
        const n = aluno.notas[materia];
        const notas = [Number(n.b1), Number(n.b2), Number(n.b3), Number(n.b4)];
        const soma = notas.reduce((a, b) => a + b, 0);
        const media = soma / 4;
        const faltas = Number(n.faltas);
        const taxaPresenca = (((200 - faltas) / 200) * 100).toFixed(1);

        dadosMedias.push(media.toFixed(1));
        dadosFaltas.push(faltas);

        let config = { cor: "#00d084", bg: "rgba(0, 208, 132, 0.1)", titulo: "PLENO", desc: "", acao: "" };

        if (faltas >= LIMITE_FALTAS) {
            config = { cor: "#ff4d4d", bg: "rgba(255, 77, 77, 0.15)", titulo: "RETIDO", desc: `⚠️ <b>REPROVADO POR FALTAS:</b> O aluno excedeu o limite legal (${faltas}).`, acao: "Encaminhar para reunião de conselho." };
        } else if (media < 6) {
            const faltam = (24 - soma).toFixed(1);
            config = { cor: "#ff4d4d", bg: "rgba(255, 77, 77, 0.15)", titulo: "CRÍTICO", desc: `❌ <b>INSUFICIENTE:</b> Média ${media.toFixed(1)}. Faltam <b>${faltam} pontos</b> para a aprovação anual.`, acao: "Reforço imediato e revisão de conteúdo." };
        } else if (media < 7.5) {
            config = { cor: "#ffa500", bg: "rgba(255, 165, 0, 0.15)", titulo: "REGULAR", desc: `🟡 <b>LIMÍTROFE:</b> Desempenho no limite mínimo. Risco de queda nos próximos bimestres.`, acao: "Incentivar participação e tarefas extras." };
        } else {
            config = { cor: "#00d084", bg: "rgba(0, 208, 132, 0.1)", titulo: "EXCELENTE", desc: `✅ <b>PLENO:</b> Domínio sólido do conteúdo e frequência exemplar (${taxaPresenca}%).`, acao: "Manter o ritmo e atuar como monitor." };
        }

        container.innerHTML += `
            <div style="background:${config.bg} !important; padding:20px; border-radius:12px; border-left:8px solid ${config.cor} !important; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; flex-direction: column; height: 100%;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <b style="color:${config.cor} !important; text-transform:uppercase; font-size:12px;">${materia}</b>
                    <span style="background:${config.cor}; color:#000; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:bold;">${config.titulo}</span>
                </div>
                <p style="color:#fff !important; font-size:13px; line-height:1.4; flex-grow:1; margin-bottom:15px;">${config.desc}</p>
                <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:6px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.1);">
                    <small style="color:${config.cor}; font-weight:bold; font-size:10px;">AÇÃO:</small><br>
                    <small style="color:#eee; font-size:11px;">${config.acao}</small>
                </div>
                <div style="display:flex; justify-content:space-between; border-top:1px solid rgba(255,255,255,0.1); padding-top:10px;">
                    <span style="font-size:11px; color:#aaa;">Média: <b style="color:#fff;">${media.toFixed(1)}</b></span>
                    <span style="font-size:11px; color:#aaa;">Presença: <b style="color:#fff;">${taxaPresenca}%</b></span>
                </div>
            </div>`;
    });

    if (instGrafico) instGrafico.destroy();
    instGrafico = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Média', data: dadosMedias, backgroundColor: '#6c5ce7', borderRadius: 4 },
                { label: 'Faltas', data: dadosFaltas, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 15, ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { ticks: { color: '#fff' }, grid: { display: false } }
            },
            plugins: { legend: { labels: { color: '#fff' } } }
        }
    });
}

function criarTurma() {
    const el = document.getElementById("nomeTurma");
    const nome = el?.value.trim();
    if (nome) {
        const cod = DB.criarTurma(nome);
        el.value = "";
        carregarTurmas();
        alert(`Sucesso! Código: ${cod}`);
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
    }
}

function logout() {
    localStorage.removeItem("user");
    location.href = "index.html";
}