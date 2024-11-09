// assets/js/scripts.js
import { Mascaras } from "./masks.js"; // Certifique-se de que o caminho esteja correto
import { APIs } from "./APIs.js";
import { popUp } from "./popUp.js";
import { Validations } from "./validations.js";

document.addEventListener("DOMContentLoaded", () => {
    const mascaras = new Mascaras(["celular", "telefone", "cpf", "cep"]);
    const apis = new APIs();
    const popUpInstance = new popUp();
    const validations = new Validations();

    // Adicionando evento para o botão "OK" com ID
    document.getElementById("ok-btn").addEventListener("click", () => {
        popUpInstance.closePopup(); // Mudança para chamar a função corretamente
    });
});