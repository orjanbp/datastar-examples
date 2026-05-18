using Microsoft.AspNetCore.Mvc.RazorPages;
using DotnetDatastar.Features.Todos.Web;

namespace DotnetDatastar.Pages;

public class TodoModel : PageModel
{
    private readonly ITodoClient _todoClient;

    public List<TodoItem> Todos { get; set; } = [];

    public TodoModel(ITodoClient todoClient)
    {
        _todoClient = todoClient ?? throw new ArgumentNullException(nameof(todoClient));
    }

    public async Task OnGetAsync()
    {
        var todos = await _todoClient.GetTodosAsync();
        // Sort newest-first (descending by id) to match Express behavior
        Todos = todos.OrderByDescending(t => t.Id).ToList();
    }
}
