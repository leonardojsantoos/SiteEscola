(function() {
  function aplicarTema() {
    const user = JSON.parse(localStorage.getItem("user"));
    const roleTemp = localStorage.getItem("role_temp");
    
    // Verifica se estamos no Dashboard (ajustado para ser mais flexível)
    const isDashboard = window.location.pathname.includes('dashboard.html') || 
                        document.querySelector('.dashboard');

    if (isDashboard) {
        // No dashboard removemos os backgrounds de login para focar nos dados
        document.body.classList.remove("aluno", "professor");
        return; 
    }

    // Define qual papel usar (o logado ou o temporário da escolha)
    const role = user?.role || roleTemp;

    if (role) {
      document.body.classList.remove("aluno", "professor");
      
      // Padroniza: docente/professor usa fundo de professor, o resto aluno
      const classeFundo = (role === "docente" || role === "professor") ? "professor" : "aluno";
      document.body.classList.add(classeFundo);
    }
  }

  // Executa imediatamente e ao carregar o DOM
  aplicarTema();
  document.addEventListener("DOMContentLoaded", aplicarTema);
})();