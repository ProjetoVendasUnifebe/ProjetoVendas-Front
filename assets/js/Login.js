function validaLogin() {

    alert("Login verificado");

    const usuarioInput = document.getElementById("usuario");
    const senhaInput = document.getElementById("senha");
    const usuario = usuarioInput.value;
    const senha = senhaInput.value;
    const loginUrl = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/realizar-login/${usuario}/${senha}`;

    fetch(loginUrl, {
        method: 'GET'
    })
        .then(async response => {
            if (response.ok) {
                const dados = await dadosUsuario(usuario);
                sessionStorage.setItem("DadosUsuario", JSON.stringify(dados));
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

async function dadosUsuario(login) {
    const usuarioUrl = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/buscar-usuario-por-login/${encodeURIComponent(
        login
    )}`;
    const response = await fetch(usuarioUrl);
    if (!response.ok) {
        toast('error', 'Erro ao buscar os dados do usuário');
    }
    const usuario = await response.json();
    return usuario;
}

/===== TOAST  =====/
function toast(tipoToast, mensagem) {
    switch (tipoToast) {
        case "success":

            Toastify({
                text: mensagem,
                className: "success",
                style: {
                    background: "linear-gradient(to right,  #711e92, #5b087c)",
                }
            }).showToast();

            break;
        case "error":

            Toastify({
                text: mensagem,
                className: "error",
                style: {
                    background: "linear-gradient(to right, #ff0000, #b30000, #800000)"
                }
            }).showToast();

            break;
    }

}
