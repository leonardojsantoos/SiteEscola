using Microsoft.EntityFrameworkCore;
using backend.Data;

var builder = WebApplication.CreateBuilder(args);


// Banco de dados SQL Server
builder.Services.AddDbContext<EscolaDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));


// Controllers
builder.Services.AddControllers();


// OpenAPI
builder.Services.AddOpenApi();


var app = builder.Build();


// Configuração do ambiente
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


app.UseHttpsRedirection();


// Rotas dos Controllers
app.MapControllers();


app.Run();