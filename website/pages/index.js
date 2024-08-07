import { send } from "../_utils";

/**
 * @typedef Book
 * @property {number} Id
 * @property {string} Title
 * @property {string} ImageSource
 */

/**@type {HTMLDivElement} */
let noBooksDiv = document.getElementById("noBooksDiv");

/**@type {HTMLDivElement} */
let loggedInDiv = document.getElementById("loggedInDiv");

/**@type {HTMLDivElement} */
let favoritesContainer = document.getElementById("favoritesContainer");

/**@type {HTMLDivElement} */
let uploadedByMeContainer = document.getElementById("uploadedByMeContainer");

/**@type {HTMLDivElement} */
let allBooksContainer = document.getElementById("allBooksContainer");

/**@type {HTMLDivElement} */
let booksContainer = document.getElementById("booksContainer");


let userId = localStorage.getItem("userId");

if (userId != null) {
  loggedInDiv.classList.remove("hidden");
  generateSortedPreviews();
}

generatePreviews();


async function generatePreviews() {
  /**@type {Book[]} */
  let books = await send("getBooks");

  if (books.length == 0) {
    booksContainer.innerText = "There are no books to display yet.";
  }
  else {
    for (let i = 0; i < books.length; i++) {
      let previewAnchor = createPreviewAnchor(books[i]);
      booksContainer.appendChild(previewAnchor);
    }
  }
}

async function generateSortedPreviews() {
  /**@type {[Book[], Book[]]} */
  let [favorites, uploadedByMe] = await send("getSortedBooks", userId);

  if (favorites.length == 0) {
    favoritesContainer.innerText = "Your favorite books will be displayed here.";
  }
  else {
    for (let i = 0; i < favorites.length; i++) {
      let previewAnchor = createPreviewAnchor(favorites[i]);
      favoritesContainer.appendChild(previewAnchor);
    }
  }

  if (uploadedByMe.length == 0) {
    uploadedByMeContainer.innerText = "Books you upload will be display here.";
  }
  else {
    for (let i = 0; i < uploadedByMe.length; i++) {
      let previewAnchor = createPreviewAnchor(uploadedByMe[i]);
      uploadedByMeContainer.appendChild(previewAnchor);
    }
  }
}

/**
 * @param {Book} book
 * @returns {HTMLAElement} 
 */
function createPreviewAnchor(book) {
  let anchor = document.createElement("a");
  anchor.classList.add("preview");
  anchor.href = "book.html?bookId=" + book.Id;

  let img = document.createElement("img");
  img.classList.add("bookImage");
  img.src = book.ImageSource;
  anchor.appendChild(img);

  let titleDiv = document.createElement("div");
  titleDiv.innerText = book.Title;
  anchor.appendChild(titleDiv);

  return anchor;
}