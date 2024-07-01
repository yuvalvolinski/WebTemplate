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
    let previewA = createPreviewA(books[i]);
    booksContainer.appendChild(previewA);
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
    let previewA = createPreviewA(favorites[i]);
    favoritesContainer.appendChild(previewA);
  }

  for (let i = 0; i < uploadedByMe.length; i++) {
    let previewA = createPreviewA(uploadedByMe[i]);
    uploadedByMeContainer.appendChild(previewA);
  }

  for (let i = 0; i < all.length; i++) {
    let previewA = createPreviewA(all[i]);
    allBooksContainer.appendChild(previewA);
  }
}

/**
 * @param {Book} book
 * @returns {HTMLAElement} 
 */
function createPreviewA(book) {
  let a = document.createElement("a");
  a.classList.add("preview");
  a.href = "book.html?bookId=" + book.Id;

  let img = document.createElement("img");
  img.classList.add("bookImage");
  img.src = book.ImageSource;
  a.appendChild(img);

  let titleDiv = document.createElement("div");
  titleDiv.innerText = book.Title;
  a.appendChild(titleDiv);

  return a;
}