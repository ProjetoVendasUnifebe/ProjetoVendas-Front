function validaLogin() {
    const usuarioInput = document.getElementById("usuario");
    const senhaInput = document.getElementById("senha");
    const usuario = usuarioInput.value;
    const senha = senhaInput.value;
    const loginUrl = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/realizar-login/${usuario}/${senha}`;

    fetch(loginUrl, {
        method: 'GET' 
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "index.html";
        } else {
            alert("Usuário ou senha inválidos.");
            usuarioInput.value = "";
            senhaInput.value = ""; 
            usuarioInput.focus(); 
        }
       
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao tentar realizar o login.");
     });
   

}
