using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly EscolaDbContext _context;

    public LoginController(EscolaDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u =>
                u.Email == request.Email &&
                u.Senha == request.Senha);

        if (usuario == null)
            return Unauthorized(new
            {
                mensagem = "Email ou senha inválidos."
            });

        return Ok(new
        {
            id = usuario.Id,
            nome = usuario.Nome,
            email = usuario.Email,
            role = usuario.Role,
            turmaId = usuario.TurmaId
        });
    }
}

public class LoginRequest
{
    public string Email { get; set; } = null!;

    public string Senha { get; set; } = null!;
}