export class popUp {
    constructor() {
        document.addEventListener("DOMContentLoaded", () => {
            this.popup = document.getElementById('popup');

            if (this.popup) {
                this._setupCloseButton();
            } else {
                console.error("Elemento popup não encontrado!");
            }
        });
    }

    showPopup(message) {
        if (this.popup) {
            const popupMessage = this.popup.querySelector("p");
            if (popupMessage) {
                popupMessage.textContent = message; // Define a mensagem do pop-up
                this.popup.classList.add("show");
                this.popup.style.display = "block";
            } else {
                console.error("Elemento <p> dentro do popup não encontrado.");
            }
        }
    }

    closePopup() {
        if (this.popup) {
            this.popup.classList.remove("show");
            setTimeout(() => {
                this.popup.style.display = "none";
            }, 300); // Delay para animação de saída
        }
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
