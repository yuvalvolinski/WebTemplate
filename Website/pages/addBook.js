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
  var book = {
    Title: titleInput.value,
    Author: authorInput.value,
    ImageSource: imageSourceInput.value,
    Description: descriptionTextarea.value,
    UploaderId: localStorage.getItem("userId"),
  };

  send("addBook", book);

  top.location.href = "index.html";
}