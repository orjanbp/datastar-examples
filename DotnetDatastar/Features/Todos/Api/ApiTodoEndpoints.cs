using DotnetDatastar.Features.Todos.Domain;
using DotnetDatastar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DotnetDatastar.Features.Todos.Api;

/// <summary>
/// Minimal API endpoints for /api/todo - mirrors Express API contract.
/// </summary>
public static class ApiTodoEndpoints
{
    public static RouteGroupBuilder MapApiTodoEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/todo");

        group.MapGet("/", GetAllTodosAsync)
            .WithName("GetAllTodos");

        group.MapGet("/{id}", GetTodoAsync)
            .WithName("GetTodo");

        group.MapPost("/", CreateTodoAsync)
            .WithName("CreateTodo")
            .Accepts<CreateTodoRequest>("application/json")
            .Produces<TodoDto>(StatusCodes.Status201Created)
            .Produces<ErrorResponse>(StatusCodes.Status400BadRequest);

        group.MapPut("/{id}", UpdateTodoAsync)
            .WithName("UpdateTodo")
            .Accepts<UpdateTodoRequest>("application/json")
            .Produces<TodoDto>()
            .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("/{id}", DeleteTodoAsync)
            .WithName("DeleteTodo")
            .Produces<TodoDto>()
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    private static async Task<IResult> GetAllTodosAsync(TodoDb db)
    {
        var todos = await db.Todos.ToListAsync();
        var dtos = todos.Select(MapToDto).ToList();
        return Results.Ok(dtos);
    }

    private static async Task<IResult> GetTodoAsync(long id, TodoDb db)
    {
        var todo = await db.Todos.FirstOrDefaultAsync(t => t.Id == id);
        if (todo is null)
        {
            return Results.NotFound();
        }

        return Results.Ok(MapToDto(todo));
    }

    private static async Task<IResult> CreateTodoAsync(CreateTodoRequest request, TodoDb db)
    {
        var name = request.Name?.Trim();

        if (string.IsNullOrEmpty(name))
        {
            var error = new ErrorResponse { Message = "TodoItem name is required" };
            return Results.BadRequest(error);
        }

        // Use Unix timestamp ID like Express (Date.now() equivalent)
        var id = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var todo = new Todo
        {
            Id = id,
            Title = name
        };

        db.Todos.Add(todo);
        await db.SaveChangesAsync();

        return Results.Created($"/api/todo/{todo.Id}", MapToDto(todo));
    }

    private static async Task<IResult> UpdateTodoAsync(long id, UpdateTodoRequest request, TodoDb db)
    {
        var name = request.Name?.Trim();

        if (string.IsNullOrEmpty(name))
        {
            var error = new ErrorResponse { Message = "TodoItem name is required" };
            return Results.BadRequest(error);
        }

        var todo = await db.Todos.FirstOrDefaultAsync(t => t.Id == id);
        if (todo is null)
        {
            return Results.NotFound();
        }

        todo.Title = name;
        await db.SaveChangesAsync();

        return Results.Ok(MapToDto(todo));
    }

    private static async Task<IResult> DeleteTodoAsync(long id, TodoDb db)
    {
        var todo = await db.Todos.FirstOrDefaultAsync(t => t.Id == id);
        if (todo is null)
        {
            return Results.NotFound();
        }

        db.Todos.Remove(todo);
        await db.SaveChangesAsync();

        return Results.Ok(MapToDto(todo));
    }

    private static TodoDto MapToDto(Todo todo) => new TodoDto
    {
        Id = todo.Id,
        Name = todo.Title
    };
}

public class ErrorResponse
{
    public string Message { get; set; } = string.Empty;
}
