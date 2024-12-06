 // Função de validação do login
 window.redefineSenha = function redefineSenha() {

toast("success","Senha nova verificada");
    
    const usuarioInput = document.getElementById("usuario");
    const senhaInput = document.getElementById("senha");
    const usuario = usuarioInput.value;
    const senhaNova = senhaInput.value;
    const redefinirSenhaUrl = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/atualizar-senha-usuario/${usuario}/${senhaNova}`;
    
    fetch(redefinirSenhaUrl, {
        method: 'PUT' 
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "login.html"; 
        } else {
            toast('error',"Usuário não encontrado");
            usuarioInput.value = ""; 
            senhaInput.value = ""; 
            usuarioInput.focus(); 
        }
       
    })
    .catch(error => {
        console.error("Erro:", error);
        toast('error',"Ocorreu um erro ao tentar mudar sua senha, verifique se o nome de usuário está correto e tente novamente.");
    });

}


document.addEventListener("DOMContentLoaded", function () {
    const senhaInput = document.getElementById("senha");
    senhaInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            redefineSenha(); 
        }
    });
});

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