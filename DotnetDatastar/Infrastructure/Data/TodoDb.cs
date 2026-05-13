using DotnetDatastar.Features.Todos.Domain;
using Microsoft.EntityFrameworkCore;

namespace DotnetDatastar.Infrastructure.Data;

public class TodoDb : DbContext
{
    public TodoDb(DbContextOptions<TodoDb> options)
        : base(options)
    {
    }

    public DbSet<Todo> Todos => Set<Todo>();
}


