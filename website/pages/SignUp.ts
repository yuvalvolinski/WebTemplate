import { send} from "./utilities";



let usernameInput = document.querySelector("usernameInput")!as HTMLInputElement
let SignupButton = document.getElementById("SignupButton")!as HTMLInputElement

send("signup" , usernameInput.value)