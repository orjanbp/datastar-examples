using DotnetDatastar.Features.Todos.Api;
using System.Net.Http.Json;

namespace DotnetDatastar.Features.Todos.Web;

/// <summary>
/// Represents a todo item as used by the web layer.
/// Mirrors Express TodoItem model.
/// </summary>
public class TodoItem
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public interface ITodoClient
{
    /// <summary>
    /// Fetch all todos from the API.
    /// </summary>
    Task<List<TodoItem>> GetTodosAsync();

    /// <summary>
    /// Create a new todo via API.
    /// </summary>
    Task<TodoItem?> CreateTodoAsync(string name);

    /// <summary>
    /// Delete a todo via API.
    /// </summary>
    Task<bool> DeleteTodoAsync(long id);
}

/// <summary>
/// Client for calling internal /api/todo endpoints.
/// Mirrors Express todoClient.ts behavior: defensive parsing, graceful fallback.
/// </summary>
public class TodoClient : ITodoClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<TodoClient> _logger;

    public TodoClient(HttpClient httpClient, ILogger<TodoClient> logger)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<List<TodoItem>> GetTodosAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("/api/todo");
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning($"Failed to fetch todos: {response.StatusCode}");
                return [];
            }

            var dtos = await response.Content.ReadFromJsonAsync<List<TodoDto>>();
            if (dtos is null)
            {
                return [];
            }

            // Defensive parsing and mapping (like Express todoClient)
            return dtos
                .Where(dto => !string.IsNullOrEmpty(dto.Name))
                .Select(dto => new TodoItem { Id = dto.Id, Name = dto.Name })
                .ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching todos");
            return [];
        }
    }

    public async Task<TodoItem?> CreateTodoAsync(string name)
    {
        try
        {
            var request = new CreateTodoRequest { Name = name };
            var response = await _httpClient.PostAsJsonAsync("/api/todo", request);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning($"Failed to create todo: {response.StatusCode}");
                return null;
            }

            var dto = await response.Content.ReadFromJsonAsync<TodoDto>();
            if (dto is null)
            {
                return null;
            }

            return new TodoItem { Id = dto.Id, Name = dto.Name };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating todo");
            return null;
        }
    }

    public async Task<bool> DeleteTodoAsync(long id)
    {
        try
        {
            var response = await _httpClient.DeleteAsync($"/api/todo/{id}");
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting todo {id}");
            return false;
        }
    }
}
