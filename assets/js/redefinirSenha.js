 // Função de validação do login
 window.redefineSenha = function redefineSenha() {

alert("Senha nova verificada");
    
    const usuarioInput = document.getElementById("usuario");
    const senhaInput = document.getElementById("senha");
    const usuario = usuarioInput.value;
    const senhaNova = senhaInput.value;
    const redefinirSenhaUrl = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/atualizar-senha-usuario/${usuario}/${senhaNova}`;
    
    fetch(redefinirSenhaUrl, {
        method: 'PUT' // Altere para POST se necessário
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "login.html"; // Redireciona para index.html
        } else {
            alert("Usuário não encontrado");
            usuarioInput.value = ""; // Limpa o campo de usuário
            senhaInput.value = ""; // Limpa o campo de senha
            usuarioInput.focus(); // Foca no campo de usuário
        }
       
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao tentar mudar sua senha, verifique se o nome de usuário está correto e tente novamente.");
    });

}

// Adiciona o evento de pressionar "Enter" ao campo de senha
document.addEventListener("DOMContentLoaded", function () {
    const senhaInput = document.getElementById("senha");
    senhaInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            redefineSenha(); // Chama a função redefineSenha() ao pressionar Enter
        }
    });
});