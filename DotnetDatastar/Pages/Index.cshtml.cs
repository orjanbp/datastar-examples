using System.ComponentModel.DataAnnotations;
using DotnetDatastar.Features.Todos.Domain;
using DotnetDatastar.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace DotnetDatastar.Pages;

public class IndexModel : PageModel
{
    private readonly TodoDb _db;

    public IndexModel(TodoDb db)
    {
        _db = db;
    }

    public IReadOnlyList<Todo> Todos { get; private set; } = [];

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

        _db.Todos.Add(new Todo
        {
            Title = title
        });

        await _db.SaveChangesAsync();
        return RedirectToPage();
    }

    public async Task<IActionResult> OnPostDeleteAsync(int id)
    {
        var todo = await _db.Todos.FindAsync(id);
        if (todo is not null)
        {
            _db.Todos.Remove(todo);
            await _db.SaveChangesAsync();
        }

        return RedirectToPage();
    }

    private async Task LoadTodosAsync()
    {
        Todos = await _db.Todos
            .AsNoTracking()
            .OrderBy(todo => todo.Id)
            .ToListAsync();
    }
}



