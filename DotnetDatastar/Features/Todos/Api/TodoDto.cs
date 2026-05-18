namespace DotnetDatastar.Features.Todos.Api;

/// <summary>
/// API DTO for todo requests/responses.
/// Matches Express API contract: { id, name }
/// </summary>
public class TodoDto
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

/// <summary>
/// Request DTO for creating a todo.
/// </summary>
public class CreateTodoRequest
{
    public string Name { get; set; } = string.Empty;
}

/// <summary>
/// Request DTO for updating a todo.
/// </summary>
public class UpdateTodoRequest
{
    public string Name { get; set; } = string.Empty;
}
