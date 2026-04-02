// Pega tipo de usuário definido anteriormente
const tipoUsuario = localStorage.getItem("tipo"); // "aluno" ou "professor"

// Se for professor, remove campo de código
const codigoInput = document.getElementById("codigoTurma");
if(tipoUsuario === "professor"){
  codigoInput.style.display = "none";
  codigoInput.required = false;
}

// Formulário de cadastro
const form = document.getElementById("formCadastro");
form.addEventListener("submit", function(e){
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const codigo = document.getElementById("codigoTurma").value.trim();

  // Validação
  if(!nome || !email || !senha){
    alert("Preencha todos os campos!");
    return;
  }
  if(tipoUsuario === "aluno" && !codigo){
    alert("Digite o código da turma!");
    return;
  }

  // Pega usuários existentes
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  if(usuarios.some(u => u.email === email)){
    alert("Email já cadastrado!");
    return;
  }

  const novoUsuario = {
    nome,
    email,
    senha,
    tipo: tipoUsuario,
    turma: tipoUsuario === "aluno" ? codigo : null
  };

  usuarios.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Cadastro realizado com sucesso!");
  window.location.href = "login.html";
});

// Redireciona para login
function irLogin(){
  window.location.href = "login.html";
}