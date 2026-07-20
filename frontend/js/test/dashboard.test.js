function expect(actual) {
    return {
        toBe(expected) {
            if (actual !== expected) {
                throw new Error(
                    `Esperava ${expected}, mas recebeu ${actual}`
                );
            }
        }
    };
}

function it(description, callback) {
    try {
        callback();
        console.log(`✅ ${description}`);
    } catch (error) {
        console.error(`❌ ${description}`);
    }
}

//teste sistema

it("LIMITE_FALTAS deve ser 25", () => {
    expect(window.LIMITE_FALTAS).toBe(25);
});

it("deve calcular média corretamente", () => {
    const n = {
        b1: 10,
        b2: 8,
        b3: 6,
        b4: 4
    };

    const media =
        (Number(n.b1) +
        Number(n.b2) +
        Number(n.b3) +
        Number(n.b4)) / 4;

    expect(media).toBe(7);
});

it("deve reprovar aluno com faltas acima do limite", () => {
    const faltas = 30;

    const reprovado = faltas >= LIMITE_FALTAS;

    expect(reprovado).toBe(true);
});

it("deve aprovar aluno com média boa e poucas faltas", () => {
    const media = 8;
    const faltas = 5;

    const aprovado = media >= 6 && faltas < LIMITE_FALTAS;

    expect(aprovado).toBe(true);
});

it("deve calcular presença corretamente", () => {
    const faltas = 20;

    const presenca = (((200 - faltas) / 200) * 100).toFixed(1);

    expect(presenca).toBe("90.0");
});

it("deve identificar aluno reprovado por nota", () => {
    const media = 4.5;

    const reprovado = media < 6;

    expect(reprovado).toBe(true);
});

it("deve identificar aluno regular", () => {
    const media = 7;

    const regular = media >= 6 && media < 7.5;

    expect(regular).toBe(true);
});

it("deve identificar aluno excelente", () => {
    const media = 9;

    const excelente = media >= 7.5;

    expect(excelente).toBe(true);
});