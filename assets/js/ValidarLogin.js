 // Função de validação do login
 function validaLogin() {

alert("Login verificado");
    
    const usuarioInput = document.getElementById("usuario");
    const senhaInput = document.getElementById("senha");
    const usuario = usuarioInput.value;
    const senha = senhaInput.value;
    const loginUrl = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/realizar-login/${usuario}/${senha}`;

    fetch(loginUrl, {
        method: 'GET' // Altere para POST se necessário
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "index.html"; // Redireciona para index.html
        } else {
            alert("Usuário ou senha inválidos.");
            usuarioInput.value = ""; // Limpa o campo de usuário
            senhaInput.value = ""; // Limpa o campo de senha
            usuarioInput.focus(); // Foca no campo de usuário
        }
       
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao tentar realizar o login.");
    });

}

// Adiciona o evento de pressionar "Enter" ao campo de senha
document.addEventListener("DOMContentLoaded", function () {
    const senhaInput = document.getElementById("senha");
    senhaInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            validaLogin(); // Chama a função validaLogin ao pressionar Enter
        }
    });
});