document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        try {
            const resposta = await fetch("http://localhost:5279/api/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    senha
                })
            });

            if (!resposta.ok) {
                alert("Email ou senha inválidos.");
                return;
            }

            const usuario = await resposta.json();

            // 1. Pega o papel selecionado no botão da index.html (se houver)
            const roleTemp = localStorage.getItem("role_temp");

            // 2. Se a pessoa escolheu um perfil diferente do cadastrado no banco, avisa o usuário
            if (roleTemp) {
                const roleBanco = (usuario.role || "").toLowerCase();
                const roleEscolha = roleTemp.toLowerCase();

                // Normaliza 'docente' e 'professor' para evitar falsos erros
                const isProfBanco = roleBanco === "professor" || roleBanco === "docente";
                const isProfEscolha = roleEscolha === "professor" || roleEscolha === "docente";

                if (isProfBanco !== isProfEscolha) {
                    alert(`Atenção: Esta conta pertence a um ${usuario.role.toUpperCase()}, mas você selecionou a opção ${roleTemp.toUpperCase()}.`);
                }
            }

            // 3. Salva os dados do usuário autenticado no localStorage
            localStorage.setItem("user", JSON.stringify(usuario));

            // 4. Limpa a seleção temporária para não interferir em acessos futuros
            localStorage.removeItem("role_temp");

            // 5. Redireciona para o dashboard
            window.location.href = "dashboard.html";

        } catch (erro) {
            console.error(erro);
            alert("Erro ao conectar com o servidor.");
        }
    });
});