import { send } from "./_utils";

let div = document.getElementById("div");
let button = document.getElementById("button");

button.onclick = async function () {
  div.innerText = "it works!";
  let bla = await send("hello", "dvir");
  console.log(bla);
}