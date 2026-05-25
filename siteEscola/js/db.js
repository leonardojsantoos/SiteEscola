const DB = (() => {
  const URL_API = "https://kvdb.io/6P96486v763m729277b758/dados_sistema_escola";

  let data = {
    usuarios: [],
    turmas: []
  };

  // =========================
  // Helpers
  // =========================

  const estruturaPadrao = () => ({
    usuarios: [],
    turmas: []
  });

  const gerarCodigo = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const salvarBackupLocal = () => {
    localStorage.setItem(
      "backup_escola_2026",
      JSON.stringify(data)
    );
  };

  const carregarBackupLocal = () => {
    try {
      const local = localStorage.getItem("backup_escola_2026");

      if (local) {
        const parsed = JSON.parse(local);

        data = {
          usuarios: parsed.usuarios || [],
          turmas: parsed.turmas || []
        };
      } else {
        data = estruturaPadrao();
      }
    } catch (e) {
      console.error("Erro ao carregar backup local:", e);
      data = estruturaPadrao();
    }
  };

  // =========================
  // Salvar
  // =========================

  const salvar = async () => {
    salvarBackupLocal();

    try {
      const resposta = await fetch(URL_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!resposta.ok) {
        throw new Error("Erro ao salvar na nuvem");
      }

      console.log("Dados sincronizados.");
    } catch (e) {
      console.warn(
        "Nuvem indisponível. Dados salvos localmente."
      );
    }
  };

  // =========================
  // API pública
  // =========================

  return {
    carregarDados: async () => {
      try {
        const resposta = await fetch(URL_API);

        if (!resposta.ok) {
          throw new Error("Falha ao buscar dados");
        }

        const texto = await resposta.text();

        // evita erro se vier vazio
        if (!texto.trim()) {
          carregarBackupLocal();
          return;
        }

        const remoto = JSON.parse(texto);

        data = {
          usuarios: remoto.usuarios || [],
          turmas: remoto.turmas || []
        };

        salvarBackupLocal();

      } catch (e) {
        console.warn("Usando backup local.");
        carregarBackupLocal();
      }
    },

    criarTurma: async (nome) => {
      nome = nome?.trim();

      if (!nome) return null;

      const existe = data.turmas.find(
        t => t.nome.toLowerCase() === nome.toLowerCase()
      );

      if (existe) return null;

      let codigo;

      do {
        codigo = gerarCodigo();
      } while (
        data.turmas.some(t => t.codigo === codigo)
      );

      data.turmas.push({
        nome,
        codigo,
        materias: [],
        alunos: []
      });

      await salvar();

      return codigo;
    },

    getTurmas: () => data.turmas,

    getTurma: (nome) =>
      data.turmas.find(
        t => t.nome.toLowerCase() === nome.toLowerCase()
      ),

    getTurmaPorCodigo: (codigo) =>
      data.turmas.find(t => t.codigo === codigo),

    getUsuarios: () => data.usuarios,

    addUsuario: async (user) => {
      if (!user?.nome || !user?.role) return false;

      const existe = data.usuarios.find(
        u =>
          u.nome.toLowerCase() ===
            user.nome.toLowerCase() &&
          u.role === user.role
      );

      if (existe) return false;

      data.usuarios.push(user);

      await salvar();

      return true;
    },

    addAluno: async (turmaNome, nome) => {
      const turma = data.turmas.find(
        t => t.nome === turmaNome
      );

      if (!turma) return false;

      const nomeLimpo = nome?.trim();

      if (!nomeLimpo) return false;

      const usuarioNoSistema =
        data.usuarios.find(
          u =>
            u.nome.toLowerCase() ===
              nomeLimpo.toLowerCase() &&
            u.role === "aluno"
        );

      if (!usuarioNoSistema) {
        return false;
      }

      const jaMatriculado =
        turma.alunos.find(
          a =>
            a.nome.toLowerCase() ===
            nomeLimpo.toLowerCase()
        );

      if (jaMatriculado) {
        return false;
      }

      const notas = {};

      turma.materias.forEach(m => {
        notas[m] = {
          b1: 0,
          b2: 0,
          b3: 0,
          b4: 0,
          faltas: 0
        };
      });

      turma.alunos.push({
        nome: usuarioNoSistema.nome,
        notas
      });

      await salvar();

      return true;
    },

    addMateria: async (turmaNome, materia) => {
      const turma = data.turmas.find(
        t => t.nome === turmaNome
      );

      if (!turma) return false;

      const matNome = materia?.trim();

      if (!matNome) return false;

      const existe = turma.materias.find(
        m => m.toLowerCase() === matNome.toLowerCase()
      );

      if (existe) return false;

      turma.materias.push(matNome);

      turma.alunos.forEach(aluno => {
        if (!aluno.notas[matNome]) {
          aluno.notas[matNome] = {
            b1: 0,
            b2: 0,
            b3: 0,
            b4: 0,
            faltas: 0
          };
        }
      });

      await salvar();

      return true;
    },

    updateNota: async (
      turmaNome,
      alunoNome,
      materia,
      campo,
      valor
    ) => {
      const turma = data.turmas.find(
        t => t.nome === turmaNome
      );

      if (!turma) return false;

      const aluno = turma.alunos.find(
        a => a.nome === alunoNome
      );

      if (!aluno) return false;

      if (!aluno.notas[materia]) return false;

      const numero = Number(valor);

      if (isNaN(numero)) return false;

      aluno.notas[materia][campo] = numero;

      await salvar();

      return true;
    }
  };
})();