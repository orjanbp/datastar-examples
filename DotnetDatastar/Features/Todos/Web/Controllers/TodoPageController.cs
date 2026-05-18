using Microsoft.AspNetCore.Mvc;
using DotnetDatastar.Features.Todos.Web;

namespace DotnetDatastar.Features.Todos.Web.Controllers;

/// <summary>
/// Web controller for todo page form submissions.
/// Mirrors Express /todo/create and /todo/delete/:id routes.
/// </summary>
[Controller]
public class TodoPageController : Controller
{
    private readonly ITodoClient _todoClient;
    private readonly ILogger<TodoPageController> _logger;

    public TodoPageController(ITodoClient todoClient, ILogger<TodoPageController> logger)
    {
        _todoClient = todoClient ?? throw new ArgumentNullException(nameof(todoClient));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// POST /todo/create - Create a new todo and redirect to todo page.
    /// </summary>
    [HttpPost("/todo/create")]
    public async Task<IActionResult> Create([FromForm] string? name)
    {
        if (!string.IsNullOrWhiteSpace(name))
        {
            await _todoClient.CreateTodoAsync(name);
        }

        return RedirectToPage("/Todo");
    }

    /// <summary>
    /// POST /todo/delete/{id} - Delete a todo and redirect to todo page.
    /// </summary>
    [HttpPost("/todo/delete/{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        await _todoClient.DeleteTodoAsync(id);
        return RedirectToPage("/Todo");
    }
}
