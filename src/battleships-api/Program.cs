using Services.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var corsPolicyName = "AllowSpecificOrigins";
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{ }

app.UsePathBase(new PathString("/api"));

app.UseRouting();

app.UseCors(corsPolicyName);

app.UseHttpsRedirection();


app.UseEndpoints(endpoints =>endpoints.MapHub<MatchEventHub>("/match-event-hub"));

app.MapControllers();

app.Run();
