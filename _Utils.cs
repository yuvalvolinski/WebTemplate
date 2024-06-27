using System.Net;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace Utils;

public static class Log
{
  public static void PrintException(Exception exception)
  {
    var shortened = ShortenException(exception);

    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine(shortened);
    Console.ResetColor();
  }

  public static string ShortenException(Exception exception)
  {
    string message = exception.Message;

    string stackTrace = exception.StackTrace ?? "";
    string[] lines = stackTrace.Split("\n");
    string[] filteredLines = lines.Where(line => line.Contains(Environment.CurrentDirectory)).ToArray();

    string? innerExceptionMessage = exception.InnerException?.Message;

    string full;
    if (innerExceptionMessage != null)
    {
      full = message + "\n" + innerExceptionMessage + "\n" + string.Join("\n", filteredLines);
    }
    else
    {
      full = message + "\n" + string.Join("\n", filteredLines);
    }

    return full;
  }
}

public class File
{
  public string Path { get; }
  public byte[] Bytes { get; }

  public File(string path)
  {
    Path = path;
    Bytes = System.IO.File.ReadAllBytes(path);
  }

  public static File? Read(string path)
  {
    if (System.IO.File.Exists(path))
    {
      return new File(path);
    }
    else
    {
      return null;
    }
  }
}

public class Server
{
  readonly HttpListener _listener;

  public Server(int port)
  {
    _listener = new HttpListener();
    _listener.Prefixes.Add($"http://*:{port}/");
    _listener.Start();
  }

  public (Request, Response) WaitForRequest()
  {
    var context = _listener.GetContext();
    var request = new Request(context);
    var response = new Response(context);
    return (request, response);
  }
}

public class Request
{
  readonly HttpListenerContext _context;

  public string Path { get; }

  public Request(HttpListenerContext context)
  {
    _context = context;

    Path = _context.Request.Url!.AbsolutePath[1..];
    if (
      (_context.Request.UrlReferrer?.AbsolutePath.EndsWith(".js") ?? false) &&
      !Path.EndsWith(".js")
    )
    {
      Path += ".js";
    }
  }

  public T GetBody<T>()
  {
    var streamReader = new StreamReader(_context.Request.InputStream, _context.Request.ContentEncoding);
    var bodyJson = streamReader.ReadToEnd();
    return JsonSerializer.Deserialize<T>(bodyJson)!;
  }

  public bool ExpectsHtml()
  {
    return _context.Request.AcceptTypes?.Contains("text/html") ?? false;
  }
}

public class Response
{
  readonly HttpListenerContext _context;

  public Response(HttpListenerContext context)
  {
    _context = context;

    if (_context.Request.Headers.Get("X-Is-Custom") != "true")
    {
      _context.Response.StatusCode = 404;
    }
  }

  public void Send<T>(T value, int statusCode = 200)
  {
    if (value is File file)
    {
      _context.Response.ContentType = file.Path.Split(".").Last() switch
      {
        "html" => "text/html; charset=utf-8",
        "js" => "application/javascript",
        _ => "application/octet-stream",
      };

      _context.Response.StatusCode = statusCode;
      _context.Response.OutputStream.Write(file.Bytes);
    }
    else
    {
      var json = JsonSerializer.Serialize(new { data = value });
      var bytes = Encoding.UTF8.GetBytes(json);
      _context.Response.OutputStream.Write(bytes);
    }
  }

  public void Close()
  {
    _context.Response.Close();
  }
}

public class DbBase : DbContext
{
  readonly string _name;

  public DbBase(string name) : base()
  {
    _name = name;

    Database.ExecuteSqlRaw("PRAGMA journal_mode = DELETE;");
  }

  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
    optionsBuilder.UseSqlite($"Data Source={_name}.sqlite");
  }
}