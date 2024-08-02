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
  /**@type {string} */
  let id = await send("logIn", [ usernameInput.value, passwordInput.value,]);

  if (id == null) {
    usernameInput.value = "";
    passwordInput.value = "";
    messageDiv.innerText = "Username or Password were incorrent";
  }
  else {
    localStorage.setItem("userId", id);
    top.location.href = "index.html";
  }
}