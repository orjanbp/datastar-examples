using DotnetDatastar.Features.Todos.Api;
using DotnetDatastar.Features.Todos.Web;
using DotnetDatastar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TodoDb>(opt => opt.UseInMemoryDatabase("TodoList"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddRazorPages();
builder.Services.AddControllers();

// Configure HttpClient for TodoClient to call local API
builder.Services
    .AddHttpClient<ITodoClient, TodoClient>()
    .ConfigureHttpClient((serviceProvider, client) =>
    {
        // Use localhost:port for internal API calls
        client.BaseAddress = new Uri("http://localhost:5109");
    });

var app = builder.Build();

// Global exception handling middleware for API errors
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        var response = new { message = exception?.Message ?? "Internal Server Error" };
        await context.Response.WriteAsJsonAsync(response);
    });
});

app.MapRazorPages();
app.MapControllers();
app.MapApiTodoEndpoints();   // New /api/todo endpoints (Express parity)
app.MapTodoEndpoints();      // Legacy /todo-items endpoints (keep for now)

app.Run();
