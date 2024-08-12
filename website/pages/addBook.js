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

addButton.onclick = async function () {
  await send(
    "addBook",
    [
      titleInput.value,
      authorInput.value,
      imageSourceInput.value,
      descriptionTextarea.value,
      localStorage.getItem("userId"),
    ]
  );

  top.location.href = "index.html";
}