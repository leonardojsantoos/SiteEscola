const DB = (() => {

  let data = JSON.parse(localStorage.getItem("db")) || {
    turmas: []
  };

  function salvar() {
    localStorage.setItem("db", JSON.stringify(data));
  }

  function criarTurma(nome) {
    data.turmas.push({
      nome,
      alunos: []
    });
    salvar();
  }

  function getTurmas() {
    return data.turmas;
  }

  function getTurma(nome) {
    return data.turmas.find(t => t.nome === nome);
  }

  function addAluno(turmaNome, nome) {
    const turma = getTurma(turmaNome);
    turma.alunos.push({
      nome,
      b1: 0, b2: 0, b3: 0, b4: 0,
      faltas: 0
    });
    salvar();
  }

  function updateAluno(turmaNome, alunoNome, campo, valor) {
    const turma = getTurma(turmaNome);
    const aluno = turma.alunos.find(a => a.nome === alunoNome);
    aluno[campo] = valor;
    salvar();
  }

  return {
    criarTurma,
    getTurmas,
    getTurma,
    addAluno,
    updateAluno
  };

})();