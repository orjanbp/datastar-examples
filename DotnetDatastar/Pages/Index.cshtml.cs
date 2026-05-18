using System.ComponentModel.DataAnnotations;
using DotnetDatastar.Features.Todos.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DotnetDatastar.Pages;

public class IndexModel : PageModel
{
    private readonly ITodoClient _todoClient;

    public IndexModel(ITodoClient todoClient)
    {
        _todoClient = todoClient ?? throw new ArgumentNullException(nameof(todoClient));
    }

    public IReadOnlyList<TodoItem> Todos { get; private set; } = [];

    [BindProperty]
    [Required]
    [StringLength(280)]
    public string Title { get; set; } = string.Empty;

    public async Task OnGetAsync()
    {
        await LoadTodosAsync();
    }

    public async Task<IActionResult> OnPostAddAsync()
    {
        var title = Title.Trim();
        if (string.IsNullOrWhiteSpace(title))
        {
            ModelState.AddModelError(nameof(Title), "Title is required.");
            await LoadTodosAsync();
            return Page();
        }

        if (!ModelState.IsValid)
        {
            await LoadTodosAsync();
            return Page();
        }

        await _todoClient.CreateTodoAsync(title);
        return RedirectToPage();
    }

    public async Task<IActionResult> OnPostDeleteAsync(long id)
    {
        await _todoClient.DeleteTodoAsync(id);
        return RedirectToPage();
    }

    private async Task LoadTodosAsync()
    {
        var todos = await _todoClient.GetTodosAsync();
        Todos = todos
            .OrderBy(todo => todo.Id)
            .ToList();
    }
}



