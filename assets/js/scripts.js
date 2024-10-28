// Função para aplicar máscara de celular
document.getElementById('celular').addEventListener('input', function (e) {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    e.target.value = (!x[2]) ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
});

// Função para aplicar máscara de telefone
document.getElementById('telefone').addEventListener('input', function (e) {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,4})(\d{0,4})/);
    e.target.value = (!x[2]) ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
});

// Função para aplicar máscara de CPF
document.getElementById('cpf').addEventListener('input', function (e) {
let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
e.target.value = (!x[2]) ? x[1] : x[1] + '.' + x[2] + (x[3] ? '.' + x[3] : '') + (x[4] ? '-' + x[4] : '');
});

// Função para aplicar máscara de CEP
document.getElementById('cep').addEventListener('input', function (e) {
let x = e.target.value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,3})/);
e.target.value = x[1] + (x[2] ? '-' + x[2] : '');
});

// Função para consultar o ViaCEP e preencher cidade e estado
document.getElementById('cep').addEventListener('blur', function () {
const cep = this.value.replace(/\D/g, '');

if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('endereco').value = data.logradouro;
            } else {
                alert('CEP não encontrado!');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar o CEP:', error);
        });
} else {
    alert('CEP inválido!');
}
});

// Função para buscar os países da API REST Countries em português
fetch('https://restcountries.com/v3.1/all?lang=pt')
.then(response => response.json())
.then(countries => {
    const countrySelect = document.getElementById('pais');

    // Ordenar os países em ordem alfabética
    countries.sort((a, b) => {
        const nameA = a.translations.por.common.toLowerCase();
        const nameB = b.translations.por.common.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    // Adicionar os países ordenados ao select
    countries.forEach(country => {
        let option = document.createElement('option');
        option.value = country.cca2; // Código do país (ex: BR para Brasil)
        option.text = country.translations.por.common; // Nome do país em português
        countrySelect.add(option);
    });
})
.catch(error => console.log('Erro ao carregar os países:', error));

function validaSenhaUsuario(){
    let senhaUsuario = document.getElementById("senhaUsuario").value;
    let confSenhaUsuario = document.getElementById("confSenhaUsuario").value;

    if(senhaUsuario !== confSenhaUsuario) {
        alert("As senhas não conferem!");
        console.log("As senhas não conferem");
    } else {
        console.log("As senhas conferem");
    }
}

