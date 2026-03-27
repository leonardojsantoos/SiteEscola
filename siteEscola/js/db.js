const DB = (() => {
  let alunos = [
    { nome: "joao", b1: 7, b2: 6, b3: 8, b4: 9, faltas: 2 },
    { nome: "maria", b1: 5, b2: 4, b3: 7, b4: 6, faltas: 4 },
    { nome: "ana", b1: 8, b2: 9, b3: 10, b4: 9, faltas: 0 },
  ];

  function getAlunos() {
    return alunos;
  }

  function addAluno(nome) {
    alunos.push({ nome, b1: 0, b2: 0, b3: 0, b4: 0, faltas: 0 });
  }

  function updateAluno(nome, campo, valor) {
    const aluno = alunos.find(a => a.nome === nome);
    if (aluno && campo in aluno) {
      aluno[campo] = valor;
    }
  }

  return {
    getAlunos,
    addAluno,
    updateAluno,
  };
})();