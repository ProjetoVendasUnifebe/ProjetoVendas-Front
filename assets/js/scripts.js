// assets/js/scripts.js
import { Mascaras } from "./masks.js";
import { APIs } from "./APIs.js";
import { popUp } from "./popUp.js";
import { Validations } from "./validations.js";

document.addEventListener("DOMContentLoaded", () => {
    const mascaras = new Mascaras(["celular", "telefone", "cpf", "cep"]);
    const apis = new APIs();
    const popUpInstance = new popUp();
    const validations = new Validations();

   
    document.getElementById("ok-btn").addEventListener("click", () => {
        popUpInstance.closePopup(); 
    });
});