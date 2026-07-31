using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotasController : ControllerBase
{
    private readonly EscolaDbContext _context;

    public NotasController(EscolaDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Nota>>> GetNotas()
    {
        return await _context.Notas
            .Include(n => n.Aluno)
            .Include(n => n.Materia)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Nota>> GetNota(int id)
    {
        var nota = await _context.Notas
            .Include(n => n.Aluno)
            .Include(n => n.Materia)
            .FirstOrDefaultAsync(n => n.Id == id);

        if (nota == null)
            return NotFound();

        return nota;
    }

    [HttpPost]
    public async Task<ActionResult<Nota>> PostNota(Nota nota)
    {
        _context.Notas.Add(nota);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetNota),
            new { id = nota.Id },
            nota
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutNota(int id, Nota nota)
    {
        if (id != nota.Id)
            return BadRequest();

        _context.Entry(nota).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNota(int id)
    {
        var nota = await _context.Notas.FindAsync(id);

        if (nota == null)
            return NotFound();

        _context.Notas.Remove(nota);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}