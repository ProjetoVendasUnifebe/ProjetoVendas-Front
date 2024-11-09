export class Mascaras {

    constructor(inputIds) {
        this.inputElements = inputIds.map(id => document.getElementById(id)).filter(element => element);
        this.inputElements.forEach(inputElement => this.mascaraInicial(inputElement));
    }

    mascaraInicial(inputElement) {
        switch (inputElement.id) {
            case 'celular':
                inputElement.addEventListener('input', this.aplicaMascaraCel.bind(this));
                break;
            case 'telefone':
                inputElement.addEventListener('input', this.aplicaMascaraTel.bind(this));
                break;
            case 'cpf':
                inputElement.addEventListener('input', this.aplicaMascaraCPF.bind(this));
                break;
            case 'cep':
                inputElement.addEventListener('input', this.aplicaMascaraCEP.bind(this));
                break;
            default:
                console.warn('Máscara não definida para este campo.');
                break;
        }
    }

    aplicaMascaraCel(event) {
        const x = event.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        event.target.value = x[1] ? `(${x[1]}) ${x[2]}${x[3] ? '-' + x[3] : ''}` : '';
    }

    aplicaMascaraTel(event) {
        const x = event.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,4})(\d{0,4})/);
        event.target.value = x[1] ? `(${x[1]}) ${x[2]}${x[3] ? '-' + x[3] : ''}` : '';
    }

    aplicaMascaraCPF(event) {
        const x = event.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
        event.target.value = x[1] ? `${x[1]}.${x[2]}${x[3] ? '.' + x[3] : ''}${x[4] ? '-' + x[4] : ''}` : '';
    }

    aplicaMascaraCEP(event) {
        const x = event.target.value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,3})/);
        event.target.value = x[1] ? `${x[1]}${x[2] ? '-' + x[2] : ''}` : '';
    }
}
