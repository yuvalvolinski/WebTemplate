using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

class Program
{
  static void Main()
  {
    int port = 5000;

    var server = new Server(port);

    Console.WriteLine($"The server is running");
    Console.WriteLine($"Main Page: http://localhost:{port}/website/pages/index.html");

    var database = new Database();

    while (true)
    {
      (var request, var response) = server.WaitForRequest();

      Console.WriteLine($"Recieved a request with the path: {request.Path}");

      var file = File.Read(request.Path);

      if (file != null)
      {
        response.Send(file);
      }
      else if (request.ExpectsHtml())
      {
        file = File.Read("website/pages/404.html");
        response.Send(file, 404);
      }
      else
      {
        try
        {
          /*──────────────────────────────────╮
          │ Handle your custome requests here │
          ╰──────────────────────────────────*/
          if (request.Path == "test")
          {
            response.Send((1, 2));
          }
          if (request.Path == "verifyUserId")
          {
            string userId = request.GetBody<string>();

            var userExists = database.Users.Any(user => user.Id == userId);

            response.Send(userExists);
          }
          else if (request.Path == "signUp")
          {
            var (username, password) = request.GetBody<(string, string)>();

            var userExists = database.Users.Any(user =>
              user.Username == username &&
              user.Password == password
            );

            if (!userExists)
            {
              var userId = Guid.NewGuid().ToString();
              database.Users.Add(new User(userId, username, password));
              response.Send(userId);
            }
          }
          else if (request.Path == "logIn")
          {
            var (username, password) = request.GetBody<(string, string)>();

            var users = database.Users.ToArray();

            string? userId = null;
            for (var i = 0; i < users.Length; i++)
            {
              if (users[i].Username == username && users[i].Password == password)
              {
                userId = users[i].Id;
              }
            }

            response.Send(userId);
          }
          else if (request.Path == "getUsername")
          {
            string userId = request.GetBody<string>();

            var user = database.Users.Find(userId);

            if (user != null)
            {
              var username = user.Username;

              response.Send(username);
            }
          }
          else if (request.Path == "getBooks")
          {
            var books = database.Books.ToArray();

            response.Send(books);
          }
          else if (request.Path == "getSortedBooks")
          {
            var userId = request.GetBody<string>();

            var all = database.Books.ToArray();

            var uploadedByMe = database.Books.Where(book => book.UploaderId == userId);

            var favorites = database.Favorites
              .Where(favorite => favorite.UserId == userId)
              .Select(favorite => favorite.Book);

            response.Send((favorites, uploadedByMe, all));
          }
          else if (request.Path == "addBook")
          {
            //contemplate this one
            var (title, author, imageSource, description, uploaderId) =
              request.GetBody<(string, string, string, string, string)>();

            var book = new Book(title, author, imageSource, description, uploaderId);

            database.Books.Add(book);
          }
          else if (request.Path == "getBookInfo")
          {

          }

          database.SaveChanges();
        }
        catch (Exception exception)
        {
          Log.PrintException(exception);
        }
      }

      response.Close();
    }


  }
}


class Database() : DbBase("database")
{
  /*──────────────────────────────╮
  │ Add your database tables here │
  ╰──────────────────────────────*/
  public DbSet<User> Users { get; set; }
  public DbSet<Book> Books { get; set; }
  public DbSet<Favorite> Favorites { get; set; }
}

class User(string id, string username, string password)
{
  [Key] public string Id { get; set; } = id;
  public string Username { get; set; } = username;
  public string Password { get; set; } = password;
}

class Book(
  string title,
  string author,
  string imageSource,
  string description,
  string uploaderId
)
{
  [Key] public int Id { get; set; }
  public string Title { get; set; } = title;
  public string Author { get; set; } = author;
  public string ImageSource { get; set; } = imageSource;
  public string Description { get; set; } = description;
  public string UploaderId { get; set; } = uploaderId;

  [ForeignKey("UploaderId")] public User? Uploader { get; set; }
}

class Favorite(string userId, int bookId)
{
  [Key] public int Id { get; set; }

  public string UserId { get; set; } = userId;
  public int BookId { get; set; } = bookId;

  [ForeignKey("UserId")] public User? User { get; set; }
  [ForeignKey("BookId")] public Book? Book { get; set; }
}