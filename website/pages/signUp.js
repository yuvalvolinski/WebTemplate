import { send } from "../_utils";

/**@type {HTMLInputElement} */
let usernameInput = document.getElementById("usernameInput");

/**@type {HTMLInputElement} */
let passwordInput = document.getElementById("passwordInput");

/**@type {HTMLButtonElement} */
let submitButton = document.getElementById("submitButton");

/**@type {HTMLDivElement} */
let messageDiv = document.getElementById("messageDiv");

submitButton.onclick = async function () {
  /**@type {string | null} */
  let userId = await send("signUp", [usernameInput.value, passwordInput.value]);

  if (userId != null) {
    localStorage.setItem("userId", userId);
    top.location.href = "index.html";
  }
  else {
    messageDiv.innerText = "Username is already taken"
  }
}