namespace backend.Models;

public class Turma
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string Codigo { get; set; } = null!;


    // Relações
    public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();

    public ICollection<Materia> Materias { get; set; } = new List<Materia>();
}