const DB = (() => {

  let data = JSON.parse(localStorage.getItem("db")) || {
    usuarios: [],
    turmas: []
  };

  function salvar() {
    localStorage.setItem("db", JSON.stringify(data));
  }

  function gerarCodigo() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  function criarTurma(nome) {
    const codigo = gerarCodigo();

    data.turmas.push({
      nome,
      codigo,
      materias: [],
      alunos: []
    });

    salvar();
    return codigo;
  }

  function getTurmas() {
    return data.turmas;
  }

  function getTurma(nome) {
    return data.turmas.find(t => t.nome === nome);
  }

  function addMateria(turmaNome, materia) {
    const turma = getTurma(turmaNome);

    if (!turma.materias.includes(materia)) {
      turma.materias.push(materia);

      turma.alunos.forEach(aluno => {
        aluno.notas[materia] = { b1: 0, b2: 0, b3: 0, b4: 0 };
      });

      salvar();
    }
  }

  function addAluno(turmaNome, nome) {
    const turma = getTurma(turmaNome);

    const notas = {};
    turma.materias.forEach(m => {
      notas[m] = { b1: 0, b2: 0, b3: 0, b4: 0 };
    });

    turma.alunos.push({
      nome,
      notas,
      faltas: 0
    });

    salvar();
  }

  function updateNota(turmaNome, alunoNome, materia, campo, valor) {
    const turma = getTurma(turmaNome);
    const aluno = turma.alunos.find(a => a.nome === alunoNome);

    aluno.notas[materia][campo] = valor;
    salvar();
  }

  function addUsuario(user) {
    data.usuarios.push(user);
    salvar();
  }

  function getUsuarios() {
    return data.usuarios;
  }

  function getTurmaPorCodigo(codigo) {
    return data.turmas.find(t => t.codigo === codigo);
  }

  return {
    criarTurma,
    getTurmas,
    getTurma,
    addMateria,
    addAluno,
    updateNota,
    addUsuario,
    getUsuarios,
    getTurmaPorCodigo
  };

})();