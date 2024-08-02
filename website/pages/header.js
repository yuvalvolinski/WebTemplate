import { send } from "../_utils";

/**@type {HTMLDivElement} */
let loggedOutDiv = document.getElementById("loggedOutDiv");

/**@type {HTMLButtonElement} */
let logInButton = document.getElementById("logInButton");

/**@type {HTMLButtonElement} */
let signUpButton = document.getElementById("signUpButton");

/**@type {HTMLDivElement} */
let loggedInDiv = document.getElementById("loggedInDiv");

/**@type {HTMLDivElement} */
let greetingDiv = document.getElementById("greetingDiv");

/**@type {HTMLButtonElement} */
let logOutButton = document.getElementById("logOutButton");

logInButton.onclick = function () {
  top.location.href = "logIn.html";
}

signUpButton.onclick = function () {
  top.location.href = "signUp.html";
}

logOutButton.onclick = function logOut() {
  localStorage.removeItem("userId");
  top.location.href = "index.html";
}

async function verifyUserId() {
  let userId = localStorage.getItem("userId");

  if (userId == null) {
    return;
  }

  /**@type {boolean} */
  let userExists = await send("verifyUserId", userId);

  if (!userExists) {
    localStorage.removeItem("userId");
  }
}

async function makeStatusVisible() {
  let userId = localStorage.getItem("userId");

  if (userId == null) {
    loggedOutDiv.classList.remove("hidden");
  }
  else {
    let username = await send("getUsername", userId);
    greetingDiv.innerText = "Welcome, " + username + "!";
    loggedInDiv.classList.remove("hidden");
  }
}

verifyUserId();
makeStatusVisible();