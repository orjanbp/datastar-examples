using DotnetDatastar.Features.Todos.Domain;
using DotnetDatastar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DotnetDatastar.Features.Todos.Api;

public static class TodoEndpoints
{
    public static RouteGroupBuilder MapTodoEndpoints(this IEndpointRouteBuilder app)
    {
        var todoItems = app.MapGroup("/todo-items");

        todoItems.MapGet("/", GetAllTodosAsync);
        todoItems.MapGet("/complete", GetCompleteTodosAsync);
        todoItems.MapGet("/{id:int}", GetTodoAsync);

        todoItems.MapPost("/", CreateTodoAsync);
        todoItems.MapPut("/{id:int}", UpdateTodoAsync);
        todoItems.MapDelete("/{id:int}", DeleteTodoAsync);

        return todoItems;
    }

    private async static Task<IResult> GetAllTodosAsync(TodoDb db) =>
        TypedResults.Ok(await db.Todos.ToArrayAsync());

    private async static Task<IResult> GetCompleteTodosAsync(TodoDb db) =>
        TypedResults.Ok(await db.Todos.Where(t => t.IsDone).ToListAsync());

    private async static Task<IResult> GetTodoAsync(int id, TodoDb db) =>
        await db.Todos.FindAsync(id)
            is {} todo
            ? TypedResults.Ok(todo)
            : TypedResults.NotFound();

    private async static Task<IResult> CreateTodoAsync(Todo todo, TodoDb db)
    {
        db.Todos.Add(todo);
        await db.SaveChangesAsync();

        return TypedResults.Created($"/todoitems/{todo.Id}", todo);
    }

    private async static Task<IResult> UpdateTodoAsync(int id, Todo inputTodo, TodoDb db)
    {
        var todo = await db.Todos.FindAsync(id);

        if (todo is null) return TypedResults.NotFound();

        todo.Title = inputTodo.Title;
        todo.IsDone = inputTodo.IsDone;

        await db.SaveChangesAsync();

        return TypedResults.NoContent();
    }

    private async static Task<IResult> DeleteTodoAsync(int id, TodoDb db)
    {
        if (await db.Todos.FindAsync(id) is not {} todo)
        {
            return TypedResults.NotFound();
        }

        db.Todos.Remove(todo);
        await db.SaveChangesAsync();

        return TypedResults.NoContent();

    }
}
