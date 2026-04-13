(function() {
  function aplicar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const roleTemp = localStorage.getItem("role_temp");
    
    // Se estiver no dashboard, não aplicamos a classe de imagem no body
    if (window.location.pathname.includes('dashboard.html')) {
        document.body.classList.remove("aluno", "professor");
        return; 
    }

    const role = user?.role || roleTemp;
    if (role) {
      document.body.classList.remove("aluno", "professor");
      const classe = (role === "docente" || role === "professor") ? "professor" : "aluno";
      document.body.classList.add(classe);
    }
  }

  aplicar();
  document.addEventListener("DOMContentLoaded", aplicar);
})();