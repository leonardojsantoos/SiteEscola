const DB = (() => {
  // Carrega os dados ou inicia um objeto vazio estruturado
  let data = JSON.parse(localStorage.getItem("db")) || {
    usuarios: [],
    turmas: []
  };

  // Salva o estado atual no localStorage
  const salvar = () => localStorage.setItem("db", JSON.stringify(data));

  // Gera códigos únicos para as turmas (Ex: A1B2C3)
  const gerarCodigo = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  return {
    criarTurma: (nome) => {
      const codigo = gerarCodigo();
      data.turmas.push({
        nome,
        codigo,
        materias: [],
        alunos: []
      });
      salvar();
      return codigo;
    },

    getTurmas: () => data.turmas,
    
    getTurma: (nome) => data.turmas.find(t => t.nome === nome),
    
    getTurmaPorCodigo: (codigo) => data.turmas.find(t => t.codigo === codigo),
    
    addUsuario: (user) => {
      data.usuarios.push(user);
      salvar();
    },
    
    getUsuarios: () => data.usuarios,

    /**
     * MATRÍCULA: Valida se o aluno existe no sistema e se já não está na turma
     */
    addAluno: (turmaNome, nome) => {
      const turma = data.turmas.find(t => t.nome === turmaNome);
      if (!turma) return false;

      const nomeLimpo = nome.trim();
      
      // Valida se o aluno criou conta
      const usuarioNoSistema = data.usuarios.find(u => 
        u.nome.toLowerCase() === nomeLimpo.toLowerCase() && u.role === "aluno"
      );

      if (!usuarioNoSistema) {
        alert(`Erro: O aluno "${nomeLimpo}" não possui uma conta no sistema!`);
        return false;
      }

      // Valida duplicata
      const jaMatriculado = turma.alunos.find(a => 
        a.nome.toLowerCase() === nomeLimpo.toLowerCase()
      );

      if (jaMatriculado) {
        alert(`Erro: O aluno "${nomeLimpo}" já está matriculado nesta turma!`);
        return false;
      }

      // Prepara o boletim do aluno com as matérias da turma
      const notas = {};
      turma.materias.forEach(m => {
        notas[m] = { b1: 0, b2: 0, b3: 0, b4: 0, faltas: 0 };
      });

      turma.alunos.push({ 
        nome: usuarioNoSistema.nome, // Usa o nome oficial do cadastro
        notas 
      });

      salvar();
      return true;
    },

    addMateria: (turmaNome, materia) => {
      const turma = data.turmas.find(t => t.nome === turmaNome);
      if (!turma) return;
      
      const matNome = materia.trim();
      if (!turma.materias.includes(matNome)) {
        turma.materias.push(matNome);
        // Adiciona a nova matéria ao boletim de todos os alunos já matriculados
        turma.alunos.forEach(a => {
          if (!a.notas[matNome]) {
            a.notas[matNome] = { b1: 0, b2: 0, b3: 0, b4: 0, faltas: 0 };
          }
        });
        salvar();
      }
    },

    updateNota: (turmaNome, alunoNome, materia, campo, valor) => {
      const turma = data.turmas.find(t => t.nome === turmaNome);
      const aluno = turma?.alunos.find(a => a.nome === alunoNome);
      
      if (aluno && aluno.notas[materia]) {
        aluno.notas[materia][campo] = Number(valor);
        salvar();
      }
    },

    removerMateria: (turmaNome, materia) => {
      const turma = data.turmas.find(t => t.nome === turmaNome);
      if (!turma) return;
      turma.materias = turma.materias.filter(m => m !== materia);
      turma.alunos.forEach(a => delete a.notas[materia]);
      salvar();
    },

    removerAluno: (turmaNome, alunoNome) => {
      const turma = data.turmas.find(t => t.nome === turmaNome);
      if (!turma) return;
      turma.alunos = turma.alunos.filter(a => a.nome !== alunoNome);
      salvar();
    }
  };
})();