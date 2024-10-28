export class popUp {
    constructor() {
        document.addEventListener("DOMContentLoaded", () => {
            this.popup = document.getElementById('popup');
            this._setupCloseButton();
        });
    }

    showPopup(message) {
        this.popup.querySelector("p").textContent = message; // Altera a mensagem do pop-up
        this.popup.classList.add("show");
        this.popup.style.display = "block";
    }

    closePopup() {
        this.popup.classList.remove("show");
        setTimeout(() => this.popup.style.display = "none", 300); // Delay para animação de saída
    }

    _setupCloseButton() {
        const closeButton = this.popup.querySelector(".close-btn");
        if (closeButton) {
            closeButton.addEventListener("click", () => this.closePopup());
        } else {
            console.error("Botão de fechar não encontrado no pop-up.");
        }
    }
}