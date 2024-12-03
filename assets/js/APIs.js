// APIs.js
import { popUp } from "./popUp.js";

export class APIs {
    constructor() {
        this.cepInput = document.getElementById('cep');
        this.countrySelect = document.getElementById('pais');
        
        // Instancia a classe popUp
        this.popupInstance = new popUp(); 
        
        this.init();
    }

    init() {
        // Adiciona o evento para o campo de CEP
        this.cepInput.addEventListener('blur', this.fetchCEP.bind(this));

        // Busca os países ao inicializar
        this.fetchCountries();
    }

    fetchCEP() {
        const cep = this.cepInput.value.replace(/\D/g, '');
    
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        // Preencher campos com dados do CEP
                        document.getElementById('cidade').value = data.localidade;
                        document.getElementById('estado').value = data.uf;
                        document.getElementById('bairro').value = data.bairro;
                        document.getElementById('rua').value = data.logradouro;
                    } else {
                        console.error('CEP não encontrado!');
                        console.log("Chamando showPopup com 'CEP não encontrado!'");
                        this.popupInstance.showPopup('CEP não encontrado!');
                        this.clearAddressFields();
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar o CEP:', error);
                    console.log("Chamando showPopup com 'Erro ao buscar o CEP. Tente novamente!'");
                    this.popupInstance.showPopup('Erro ao buscar o CEP. Tente novamente!');
                });
        } else {
            console.error('CEP Inválido!');
            console.log("Chamando showPopup com 'CEP inválido!'");
            this.popupInstance.showPopup('CEP inválido!');
        }
    }
    
    clearAddressFields() {
        document.getElementById('cidade').value = '';
        document.getElementById('estado').value = '';
        document.getElementById('bairro').value = '';
        document.getElementById('rua').value = '';
        document.getElementById('cep').value = '';
    }
    

    fetchCountries() {
        fetch('https://restcountries.com/v3.1/all?lang=pt')
            .then(response => response.json())
            .then(countries => {
                // Ordenar os países em ordem alfabética
                countries.sort((a, b) => {
                    const nameA = a.translations.por.common.toLowerCase();
                    const nameB = b.translations.por.common.toLowerCase();
                    return nameA.localeCompare(nameB);
                });

                // Adicionar os países ordenados ao select
                countries.forEach(country => {
                    let option = document.createElement('option');
                    option.value = country.cca2; // Código do país (ex: BR para Brasil)
                    option.text = country.translations.por.common; // Nome do país em português
                    this.countrySelect.add(option);
                });
            })
            .catch(error => console.log('Erro ao carregar os países:', error));
    }
}
