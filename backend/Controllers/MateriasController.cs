using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MateriasController : ControllerBase
{
    private readonly EscolaDbContext _context;

    public MateriasController(EscolaDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Materia>>> GetMaterias()
    {
        return await _context.Materias
            .Include(m => m.Turma)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Materia>> GetMateria(int id)
    {
        var materia = await _context.Materias
            .Include(m => m.Turma)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (materia == null)
            return NotFound();

        return materia;
    }

    [HttpPost]
    public async Task<ActionResult<Materia>> PostMateria(Materia materia)
    {
        _context.Materias.Add(materia);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetMateria),
            new { id = materia.Id },
            materia
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutMateria(int id, Materia materia)
    {
        if (id != materia.Id)
            return BadRequest();

        _context.Entry(materia).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMateria(int id)
    {
        var materia = await _context.Materias.FindAsync(id);

        if (materia == null)
            return NotFound();

        _context.Materias.Remove(materia);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}