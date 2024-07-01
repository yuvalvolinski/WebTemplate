import { query, send } from "../_utils";

/**
 * @typedef Book
 * @property {string} Title
 * @property {string} Author
 * @property {string} ImageSource
 * @property {string} Description
 */

/**@type {HTMLTitleElement} */
let title = document.getElementsByTagName("title");

/**@type {HTMLHeadingElement} */
let titleHeading = document.getElementById("titleHeading");

/**@type {HTMLHeadingElement} */
let authorHeading = document.getElementById("authorHeading");

/**@type {HTMLImageElement} */
let coverImg = document.getElementById("coverImg");

/**@type {HTMLHeadingElement} */
let uploaderHeading = document.getElementById("uploaderHeading");

/**@type {HTMLDivElement} */
let favoriteDiv = document.getElementById("favoriteDiv");

/**@type {HTMLInputElement} */
let favoriteCheckbox = document.getElementById("favoriteCheckbox");

/**@type {HTMLDivElement} */
let descriptionDiv = document.getElementById("descriptionDiv");


let userId = localStorage.getItem("userId");
let bookId = Number(query.bookId);

appendBook();

favoriteCheckbox.onchange = function() {
  if (favoriteCheckbox.checked) {
    console.log("checked");
    send("addToFavorites", [userId, bookId]);
  }
  else {
    send("removeFromFavorites", [userId, bookId]);
  }
}

async function appendBook() {
  /**@type {[Book, string, boolean]} */
  let [book, uploader, isFavorite] = await send("getBookInfo", [userId, bookId]);

  document.title = book.Title;
  titleHeading.innerText = book.Title;
  authorHeading.innerText = `by ${book.Author}`;
  uploaderHeading.innerText = `Uploaded by ${uploader}`
  coverImg.src = book.ImageSource;

  if (userId != null) {
    favoriteDiv.classList.remove("hidden");
    favoriteCheckbox.checked = isFavorite;
  }

  descriptionDiv.innerText = book.Description;
}

