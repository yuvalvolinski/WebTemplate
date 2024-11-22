import { send } from "../utilities";

send


let b = document.getElementById("b")!

b.onclick = async function() {
    let num = await send("Lecrment",null) as number;
    console.log(num);

}