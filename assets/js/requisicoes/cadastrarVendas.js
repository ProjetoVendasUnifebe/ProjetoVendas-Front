        function cadastrarVenda() {

            const url = 'https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Venda/cadastrar-venda';
            
            // Captura os valores dos campos do formulário
            const IdUsuario = document.getElementById("IdUsuario").value;
            const IdCliente = document.getElementById("IdCliente").value;
            const valor = document.getElementById("valor").value;
            const forma_pagamento = document.getElementById("forma_pagamento").value;
            
            const dadosVenda = {
                IdUsuario: IdUsuario,
                IdCliente: IdCliente,
                valor: valor,
                forma_pagamento: forma_pagamento
                
            };
    
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosVenda)
                
            })
            .then(response => {
                if (response.ok) {
                    return response.json(); 
                } else {
                    console.error('Erro ao cadastrar venda');
                    toast("error", "Erro ao cadastrar venda");
                }
            })
            .then(data => {
                console.log('venda cadastrada com sucesso:', data);
                toast("success", "venda cadastrada com sucesso!");
                window.location.href = "../Listas/listagemVendas.html"; // Redireciona após sucesso
            })
            .catch(error => {
                console.error('Erro:', error);
                toast("error", "Ocorreu um erro ao tentar cadastrar a venda.");
            });
        }

        document.querySelector(".cadastro-form").addEventListener("submit", cadastrarVenda);
    

        input.addEventListener('change', function() {
            console.log('Valor final do input:', input.value)  // Exibe o valor após a edição
           
          });

// /===== TOAST  =====/
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



   


