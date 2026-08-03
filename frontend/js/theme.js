(function() {
  function aplicarTema() {
    const user = JSON.parse(localStorage.getItem("user"));
    const roleTemp = localStorage.getItem("role_temp");
    
    // Identifica se está no Dashboard
    const isDashboard = window.location.pathname.includes('dashboard.html') || 
                        document.querySelector('.dashboard');

    if (isDashboard) {
        // No dashboard, quem manda é o ROLE do usuário que logou
        const roleDashboard = (user?.role || "").toLowerCase();
        const isProf = (roleDashboard === "docente" || roleDashboard === "professor");
        
        document.body.classList.remove("aluno", "professor");
        document.body.classList.add(isProf ? "professor" : "aluno");
        return; 
    }

    // Nas telas de Login, Cadastro e Escolha:
    // DÁ PRIORIDADE AO BOTÃO QUE FOI CLICADO (role_temp)
    const role = roleTemp || user?.role;

    if (role) {
      document.body.classList.remove("aluno", "professor");
      
      const roleStr = String(role).toLowerCase();
      const classeFundo = (roleStr === "docente" || roleStr === "professor") ? "professor" : "aluno";
      
      document.body.classList.add(classeFundo);
    }
  }

  // Executa imediatamente e ao carregar o DOM
  aplicarTema();
  document.addEventListener("DOMContentLoaded", aplicarTema);
})();