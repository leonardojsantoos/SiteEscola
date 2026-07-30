using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class EscolaDbContext : DbContext
{
    public EscolaDbContext(DbContextOptions<EscolaDbContext> options)
        : base(options)
    {
    }


    public DbSet<Usuario> Usuarios { get; set; }

    public DbSet<Turma> Turmas { get; set; }

    public DbSet<Materia> Materias { get; set; }

    public DbSet<Nota> Notas { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>()
            .HasOne(u => u.Turma)
            .WithMany(t => t.Usuarios)
            .HasForeignKey(u => u.TurmaId);


        modelBuilder.Entity<Materia>()
            .HasOne(m => m.Turma)
            .WithMany(t => t.Materias)
            .HasForeignKey(m => m.TurmaId);


        modelBuilder.Entity<Nota>()
            .HasOne(n => n.Aluno)
            .WithMany(u => u.Notas)
            .HasForeignKey(n => n.AlunoId)
            .OnDelete(DeleteBehavior.Restrict);


        modelBuilder.Entity<Nota>()
            .HasOne(n => n.Materia)
            .WithMany(m => m.Notas)
            .HasForeignKey(n => n.MateriaId);
    }
}