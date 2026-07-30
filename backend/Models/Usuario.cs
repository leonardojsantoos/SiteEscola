namespace backend.Models;

public class Usuario
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Senha { get; set; } = null!;

    public string Role { get; set; } = null!;


    public int? TurmaId { get; set; }

    // Relação
    public Turma? Turma { get; set; }


    public ICollection<Nota> Notas { get; set; } = new List<Nota>();
}