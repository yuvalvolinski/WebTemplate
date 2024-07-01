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
let titleH1 = document.getElementById("titleH1");

/**@type {HTMLHeadingElement} */
let authorH2 = document.getElementById("authorH2");

/**@type {HTMLImageElement} */
let coverImg = document.getElementById("coverImg");

/**@type {HTMLHeadingElement} */
let uploaderH2 = document.getElementById("uploaderH2");

/**@type {HTMLButtonElement} */
let favoriteButton = document.getElementById("favoriteButton");

/**@type {HTMLButtonElement} */
let unfavoriteButton = document.getElementById("unfavoriteButton");

/**@type {HTMLDivElement} */
let descriptionDiv = document.getElementById("descriptionDiv");


let userId = localStorage.getItem("userId");
let bookId = Number(query.bookId);

appendBook();


favoriteButton.onclick = async function () {
  await send("addToFavorites", [userId, bookId]);

  favoriteButton.disabled = true;
  unfavoriteButton.disabled = false;
}

unfavoriteButton.onclick = async function () {
  await send("removeFromFavorites", [userId, bookId]);

  favoriteButton.disabled = false;
  unfavoriteButton.disabled = true;
}

async function appendBook() {
  /**@type {[Book, string, boolean]} */
  let [book, uploader, isFavorite] = await send("/getBookInfo", bookId);

  document.title = book.Title;
  titleH1.innerText = book.Title;
  authorH2.innerText = `by ${book.Author}`;
  uploaderH2.innerText = `Uploaded by ${uploader}`
  coverImg.src = book.ImageSource;

  descriptionDiv.innerText = book.Description;

  if (userId == undefined) {
    favoriteButton.style.display = "none";
    unfavoriteButton.style.display = "none";
    return;
  }

  favoriteButton.disabled = isFavorite;
  unfavoriteButton.disabled = !isFavorite;
}

