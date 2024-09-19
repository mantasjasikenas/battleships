using Services.Hubs;

const string corsPolicyName = "AllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsPolicyName,
        policy =>
        {
            policy.AllowAnyOrigin();
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();
            policy.SetIsOriginAllowed(_ => true);
        });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSignalR();


var app = builder.Build();

app.UsePathBase(new PathString("/api"));

app.UseRouting();

app.UseCors(corsPolicyName);

app.UseHttpsRedirection();

app.MapHub<MatchEventHub>("/match-event-hub");

app.MapControllers();

app.Run();