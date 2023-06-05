using Microsoft.AspNetCore.StaticFiles;
using SignalRChat.Hubs;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddSignalR().AddAzureSignalR("Endpoint=https://testwout.service.signalr.net;AccessKey=W2rqLpD+CFxQjzTs8keMw6cVvyWPe3QOpRGceR63cn0=;Version=1.0;");
var app = builder.Build();

var provider = new FileExtensionContentTypeProvider();
provider.Mappings.Add(".gltf", "text/xml");
app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = provider
});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();
app.MapHub<ChatHub>("/chatHub");

app.Run();
