import { send } from "../_utils";

/**@type {HTMLInputElement} */
let titleInput = document.getElementById("titleInput");

/**@type {HTMLInputElement} */
let authorInput = document.getElementById("authorInput");

/**@type {HTMLInputElement} */
let imageSourceInput = document.getElementById("imageSourceInput");

/**@type {HTMLTextAreaElement} */
let descriptionTextarea = document.getElementById("descriptionTextarea");

/**@type {HTMLButtonElement} */
let addButton = document.getElementById("addButton");

addButton.onclick = function () {
  let title = titleInput.value;
  let author = authorInput.value;
  let imageSource = imageSourceInput.value;
  let description = descriptionTextarea.value;
  let uploaderId = localStorage.getItem("userId");

  send("addBook", [title, author, imageSource, description, uploaderId]);

  top.location.href = "index.html";
}