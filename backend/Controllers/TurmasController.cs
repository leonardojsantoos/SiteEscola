using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TurmasController : ControllerBase
{
    private readonly EscolaDbContext _context;

    public TurmasController(EscolaDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Turma>>> GetTurmas()
    {
        return await _context.Turmas.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Turma>> GetTurma(int id)
    {
        var turma = await _context.Turmas.FindAsync(id);

        if (turma == null)
            return NotFound();

        return turma;
    }

    [HttpPost]
    public async Task<ActionResult<Turma>> PostTurma(Turma turma)
    {
        _context.Turmas.Add(turma);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetTurma),
            new { id = turma.Id },
            turma
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutTurma(int id, Turma turma)
    {
        if (id != turma.Id)
            return BadRequest();

        _context.Entry(turma).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTurma(int id)
    {
        var turma = await _context.Turmas.FindAsync(id);

        if (turma == null)
            return NotFound();

        _context.Turmas.Remove(turma);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("codigo/{codigo}")]
public async Task<ActionResult<Turma>> GetTurmaPorCodigo(string codigo)
{
    var turma = await _context.Turmas
        .FirstOrDefaultAsync(t => t.Codigo == codigo);

    if (turma == null)
        return NotFound();

    return turma;
}
}