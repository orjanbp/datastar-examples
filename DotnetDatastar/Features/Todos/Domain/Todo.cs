using System.ComponentModel.DataAnnotations;

namespace DotnetDatastar.Features.Todos.Domain;

public class Todo
{
    public long Id { get; set; }

    [MaxLength(280)]
    public string Title { get; set; } = string.Empty;

    public bool IsDone { get; set; }
}
