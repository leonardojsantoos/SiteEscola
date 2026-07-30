namespace backend.Models;

public class Materia
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;


    public int TurmaId { get; set; }

    // Relação
    public Turma Turma { get; set; } = null!;


    public ICollection<Nota> Notas { get; set; } = new List<Nota>();
}