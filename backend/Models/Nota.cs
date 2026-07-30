namespace backend.Models;

public class Nota
{
    public int Id { get; set; }

    public int AlunoId { get; set; }

    public int MateriaId { get; set; }


    public decimal B1 { get; set; }

    public decimal B2 { get; set; }

    public decimal B3 { get; set; }

    public decimal B4 { get; set; }

    public int Faltas { get; set; }


    // Relações
    public Usuario Aluno { get; set; } = null!;

    public Materia Materia { get; set; } = null!;
}