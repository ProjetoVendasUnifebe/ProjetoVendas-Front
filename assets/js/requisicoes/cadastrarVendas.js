        function cadastrarVenda() {

            const url = 'https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Venda/cadastrar-venda';
            
            // Captura os valores dos campos do formulário
            const IdUsuario = document.getElementById("IdUsuario").value;
            const IdCliente = document.getElementById("IdCliente").value;
            const valor = document.getElementById("valor").value;
            const forma_pagamento = document.getElementById("forma_pagamento").value;
            // Cria o objeto de dados a ser enviado na requisição
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
                    return response.json(); // Converte a resposta em JSON se for bem-sucedida
                } else {
                    throw new Error('Erro ao cadastrar venda');
                }
            })
            .then(data => {
                console.log('venda cadastrada com sucesso:', data);
                alert("venda cadastrada com sucesso!");
                window.location.href = "../Listas/listagemVendas.html"; // Redireciona após sucesso
            })
            .catch(error => {
                console.error('Erro:', error);
                alert("Ocorreu um erro ao tentar cadastrar a venda.");
            });
        }

        // Adiciona o evento de submissão ao formulário
        document.querySelector(".cadastro-form").addEventListener("submit", cadastrarVenda);
    
        // // Fecha o popup de aviso
        // document.getElementById("ok-btn").addEventListener("click", function() {
        //     document.getElementById("popup").style.display = "none";
        // });

        input.addEventListener('change', function() {
            console.log('Valor final do input:', input.value)  // Exibe o valor após a edição
           
          });





   


