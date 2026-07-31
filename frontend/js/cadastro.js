document.addEventListener("DOMContentLoaded", () => {
    const roleTemp = localStorage.getItem("role_temp");

    const areaTurma = document.getElementById("area-turma");
    const inputCodigo = document.getElementById("codigoTurma");
    const form = document.getElementById("formCadastro");

    if (roleTemp === "professor") {
        areaTurma.style.display = "none";
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        let turmaId = null;

        if (roleTemp !== "professor") {
            const codigo = inputCodigo.value.trim().toUpperCase();

            const respostaTurma = await fetch(
                `http://localhost:5279/api/Turmas/codigo/${codigo}`
            );

            if (!respostaTurma.ok) {
                alert("Código da turma inválido.");
                return;
            }

            const turma = await respostaTurma.json();
            turmaId = turma.id;
        }

        const resposta = await fetch(
            "http://localhost:5279/api/Usuarios",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    role: roleTemp === "professor" ? "professor" : "aluno",
                    turmaId
                })
            }
        );

        if (!resposta.ok) {
            alert("Erro ao cadastrar usuário.");
            return;
        }

        alert("Conta criada com sucesso!");
        location.href = "login.html";
    });
});