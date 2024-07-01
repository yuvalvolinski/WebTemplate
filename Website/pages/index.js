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
let loggedOutDiv = document.getElementById("loggedOutDiv");

/**@type {HTMLDivElement} */
let favoritesContainer = document.getElementById("favoritesContainer");

/**@type {HTMLDivElement} */
let uploadedByMeContainer = document.getElementById("uploadedByMeContainer");

/**@type {HTMLDivElement} */
let allBooksContainer = document.getElementById("allBooksContainer");

/**@type {HTMLDivElement} */
let booksContainer = document.getElementById("booksContainer");


let userId = localStorage.getItem("userId");

if (userId == null) {
  loggedOutDiv.classList.remove("hidden");
  generatePreviews();
}
else {
  loggedInDiv.classList.remove("hidden");
  generateSortedPreviews();
}


async function generatePreviews() {
  /**@type {Book[]} */
  let books = await send("getBooks");

  if (books.length == 0) {
    noBooksDiv.classList.remove("hidden");
  }

  for (let i = 0; i < books.length; i++) {
    let previewAnchor = createPreviewAnchor(books[i]);
    booksContainer.appendChild(previewAnchor);
  }
}

async function generateSortedPreviews() {
  /**@type {[Book[], Book[], Book[]]} */
  let [favorites, uploadedByMe, all] = await send("getSortedBooks", userId);

  console.log(all);

  if (all.length == 0) {
    noBooksDiv.classList.remove("hidden");
  }

  for (let i = 0; i < favorites.length; i++) {
    let previewAnchor = createPreviewAnchor(favorites[i]);
    favoritesContainer.appendChild(previewAnchor);
  }

  for (let i = 0; i < uploadedByMe.length; i++) {
    let previewAnchor = createPreviewAnchor(uploadedByMe[i]);
    uploadedByMeContainer.appendChild(previewAnchor);
  }

  for (let i = 0; i < all.length; i++) {
    let previewAnchor = createPreviewAnchor(all[i]);
    booksContainer.appendChild(previewAnchor);
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