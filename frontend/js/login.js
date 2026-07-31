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

            localStorage.setItem("user", JSON.stringify(usuario));

            window.location.href = "dashboard.html";

        } catch (erro) {
            console.error(erro);
            alert("Erro ao conectar com o servidor.");
        }

    });

});