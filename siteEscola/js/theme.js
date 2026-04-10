function aplicarTema() {
  const user = JSON.parse(localStorage.getItem("user"));

  document.body.classList.remove("aluno", "professor");

  if (user?.role === "docente") {
    document.body.classList.add("professor");
  } else {
    document.body.classList.add("aluno");
  }
}

document.addEventListener("DOMContentLoaded", aplicarTema);