const DB = (() => {
  // Usando uma chave pública com formato correto aceito pelo KVdb
  const URL_API = "https://kvdb.io/6P96486v763m729277b758/dados_sistema_escola";

  let data = {
    usuarios: [],
    turmas: []
  };

  // Função auxiliar de segurança: se a nuvem falhar, o sistema usa o computador local
  const carregarBackupLocal = () => {
    const local = localStorage.getItem("backup_escola_2026");
    if (local) {
      data = JSON.parse(local);
    } else {
      data = { usuarios: [], turmas: [] };
    }
  };

  const salvar = async () => {
    // 1. Sempre salva localmente primeiro (Garante o funcionamento sem travar)
    localStorage.setItem("backup_escola_2026", JSON.stringify(data));

    // 2. Tenta mandar para a nuvem em segundo plano
    try {
      await fetch(URL_API, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      console.warn("Nuvem indisponível temporariamente. Dados salvos localmente.");
    }
  };

  const gerarCodigo = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  return {
    carregarDados: async () => {
      try {
        const resposta = await fetch(URL_API);
        if (resposta.ok) {
          data = await resposta.json();
          localStorage.setItem("backup_escola_2026", JSON.stringify(data));
        } else {
          carregarBackupLocal();
        }
      } catch (e) {
        carregarBackupLocal();
      }
    },

    criarTurma: async (nome) => {
      const codigo = gerarCodigo();
      data.turmas.push({ nome, codigo, materias: [], alunos: [] });
      await salvar();
      return codigo;
    },

    getTurmas: () => data.turmas,
    getTurma: (nome) => data.turmas.find(t => t.nome === nome),
    getTurmaPorCodigo: (codigo) => data.turmas.find(t => t.codigo === codigo),
    
    addUsuario: async (user) => {
      data.usuarios.push(user);
      await salvar();
    },
    
    getUsuarios: () => data.usuarios,

    addAluno: async (turmaNome, nome) => {
      const turma = data.turmas.find(t => t.nome === turmaNome);
      if (!turma) return false;

      const nomeLimpo = nome.trim();
      const usuarioNoSistema = data.usuarios.find(u => 
        u.nome.toLowerCase() === nomeLimpo.toLowerCase() && u.role === "aluno"
      );

      if (!usuarioNoSistema) return false;

      const jaMatriculado = turma.alunos.find(a => a.nome.toLowerCase() === nomeLimpo.toLowerCase());
      if (jaMatriculado) return false;

      const notas = {};
      if (turma.materias) {
        turma.materias.forEach(m => {
          notas[m] = { b1: 0, b2: 0, b3: 0, b4: 0, faltas: 0 };
        });
      }

      turma.alunos.push({ nome: usuarioNoSistema.nome, notas });
      await salvar();
      return true;
    },

    addMateria: async (turmaNome, materia) => {
      const turma = data.turmas.find(t => t.nome === turmaNome);
      if (!turma) return;
      
      const matNome = materia.trim();
      if (!turma.materias.includes(matNome)) {
        turma.materias.push(matNome);
        turma.alunos.forEach(a => {
          if (!a.notas[matNome]) a.notas[matNome] = { b1: 0, b2: 0, b3: 0, b4: 0, faltas: 0 };
        });
        await salvar();
      }
    },

    updateNota: async (turmaNome, alunoNome, materia, campo, valor) => {
      const turma = data.turmas.find(t => t.nome === turmaNome);
      const aluno = turma?.alunos.find(a => a.nome === alunoNome);
      
      if (aluno && aluno.notas[materia]) {
        aluno.notas[materia][campo] = Number(valor);
        await salvar();
      }
    }
  };
})();