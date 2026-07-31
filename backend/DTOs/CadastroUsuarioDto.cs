namespace backend.DTOs;

public class CadastroUsuarioDto
{
    public string Nome { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Senha { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public int? TurmaId { get; set; }
}