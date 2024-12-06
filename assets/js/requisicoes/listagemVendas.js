
const baseUrl = 'https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Venda';

const lista = document.getElementById('lista-produtos');
// Função para listar todos os produtos

    function formatarData(data){

        // Convertendo a data para o formato brasileiro
            let dataFormatada = new Date(data).toLocaleDateString("pt-BR");

            
            let horaFormatada = new Date(data).toLocaleTimeString("pt-BR", {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });

            return dataFormatada + ' ' + horaFormatada
    }

async function ListaVenda() {
    try {
        const resposta = await fetch(`${baseUrl}/buscar-todas-vendas`);
        if (!resposta.ok) {
            console.error(`Erro ao acessar API: ${resposta.status}`);
            toast("error", "Erro de requisição");
        }
        const vendas = await resposta.json();
        const tbody = document.querySelector('#vendas-container')

        tbody.innerHTML = '';
       

        if (Array.isArray(vendas)) {
            vendas.forEach(venda => {
                const row = document.createElement('tr');                
                row.innerHTML = `
                    <th scope="row">${venda.idVenda}</th>
                    <td>${venda.idUsuario}</td>
                    <td>${venda.idCliente}</td>
                    <td>${venda.valor}</td>
                    <td>${formatarData(venda.data_venda)}</td>
                    <td>${venda.forma_pagamento}</td>
                    <td>
                        <ion-icon name="create-outline" class="button-edit" data-id="${venda.idVenda}" onclick="editarVenda(this)">Editar</ion-icon>
                        <ion-icon name="trash" class="button-delete" data-id="${venda.idVenda}" onclick="excluirVenda(this)">Apagar</ion-icon>
                    </td>`;

                tbody.appendChild(row);
            });
        } else {
            console.error('A resposta não é um array:', vendas);
        }
    } catch (error) {
        console.error('Ocorreu um problema na sua requisição', error);
    }
}
document.addEventListener('DOMContentLoaded', ListaVenda);

// Função para buscar venda pelo ID 
async function pesquisarVenda() {
    const pesquisaInput = document.getElementById('pesquisaVenda').value.trim();

    // Se o campo estiver vazio, busca todos os produtos
    if (!pesquisaInput) {
        ListaVenda();
        return;
    }

    
    const url = `${baseUrl}/buscar-venda-por-id/${pesquisaInput}`;

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            console.error(`Erro ao acessar API: ${resposta.status}`);
            toast("error", "Erro de requisição");
        }

        const venda = await resposta.json();
        const tbody = document.querySelector('#vendas-container');
        
        tbody.innerHTML = ''; // Limpar lista antes de preencher

        // Verificar se a venda foi encontrada
        if (!venda || !venda.idVenda) {
            lista.textContent = 'Nenhuma venda encontrada.';
            return;
        }

        // Exibir venda
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row">${venda.idVenda}</th>
            <td>${venda.idUsuario}</td>
            <td>${venda.idCliente}</td>
            <td>${venda.valor}</td>
            <td>${formatarData(venda.data_venda)}</td>
            <td>${venda.forma_pagamento}</td>
            <td>
                <ion-icon name="create-outline" class="button-edit" data-id="${venda.idVenda}" onclick="editarVenda(this)">Editar</ion-icon>
                <ion-icon name="trash" class="button-delete" data-id="${venda.idVenda}" onclick="excluirVenda(this)">Apagar</ion-icon>
            </td>`;

        tbody.appendChild(row);
    } catch (erro) {
        console.error('Erro ao buscar venda:', erro);
        lista.textContent = 'Erro ao buscar venda.';
    }
}

// Carregar todos os produtos inicialmente
ListaVenda();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function pesquisarVendaData() {
    

    const dataInicioInput = document.getElementById('dataInicio').value.trim();
    const dataFimInput = document.getElementById('dataFim').value.trim();

     
     if (!dataInicioInput && !dataFimInput) {
        ListaVenda();
        return;
    }

    
    let url = `${baseUrl}/buscar-vendas-por-data`;

     
     if (dataInicioInput && dataFimInput) {
        url += `?dataInicio=${dataInicioInput}&dataFim=${dataFimInput}`;
    } else if (dataInicioInput) {
        
        url += `?dataInicio=${dataInicioInput}`;
    } else if (dataFimInput) {
        
        url += `?dataFim=${dataFimInput}`;
    }

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            console.error(`Erro ao acessar API: ${resposta.status}`);
            toast("error", "Erro de requisição");
        }

        const vendas = await resposta.json();
        const tbody = document.querySelector('#vendas-container');
        
        tbody.innerHTML = ''; 

        // Verificar se alguma venda foi encontrada
        if (!vendas || vendas.length === 0) {
            tbody.textContent = 'Nenhuma venda encontrada.';
            return;
        }
        

        // Exibir vendas
        vendas.forEach(venda => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${venda.idVenda}</th>
                <td>${venda.idUsuario}</td>
                <td>${venda.idCliente}</td>
                <td>${venda.valor}</td>
                <td>${formatarData(venda.data_venda)}</td>
                <td>${venda.forma_pagamento}</td>
                <td>
                    <ion-icon name="create-outline" class="button-edit" data-id="${venda.idVenda}" onclick="editarVenda(this)">Editar</ion-icon>
                    <ion-icon name="trash" class="button-delete" data-id="${venda.idVenda}" onclick="excluirVenda(this)">Apagar</ion-icon>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (erro) {
        console.error('Erro ao buscar venda:', erro);
        tbody.textContent = 'Erro ao buscar venda.';
    }
}


ListaVenda();

    

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function editarVenda(element) {

let id = element.getAttribute('data-id');

const modal = document.getElementById('editarVendaModal');
const IdUsuarioInput = document.getElementById('IdUsuario');
const IdClienteInput = document.getElementById('IdCliente');
const dataCadastroInput = document.getElementById('dataCadastro');
const forma_pagamentoInput = document.getElementById('forma_pagamento');
const ValorInput = document.getElementById('Valor');



modal.style.display = 'block';


console.log(id)
try {
    const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Venda/buscar-venda-por-id/${id}`);
    if (!response.ok) {
        const errorMessage = await response.text();
        console.error(`Erro ao buscar venda: ${response.status} - ${errorMessage}`);
        toast("error", "Erro de requisição");
    }

    const venda = await response.json();
    IdUsuarioInput.value = venda.idUsuario || '';
    IdClienteInput.value = venda.idCliente || '';
    dataCadastroInput.value = venda.data_venda || '';
    forma_pagamentoInput.value = venda.forma_pagamento || '';
    ValorInput.value = venda.valor || '';
   
} catch (error) {
    console.error('Erro ao buscar Venda:', error);
    toast("error", "Erro ao buscar os dados da Venda. Tente novamente.");
    modal.style.display = 'none';
    return;
}


const salvarEdicaoButton = document.getElementById('salvarEdicao');
salvarEdicaoButton.onclick = async () => {
    const IdUsuario = IdUsuarioInput.value.trim();
    const IdCliente = IdClienteInput.value.trim();
    const dataCadastro = dataCadastroInput.value.trim();
    const forma_pagamento = forma_pagamentoInput.value.trim();
    const valor = ValorInput.value.trim();


    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Venda/atualizar-venda`, {
            method: 'PUT',
            headers: {  
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idVenda: id,
                idUsuario: IdUsuario,
                idCliente: IdCliente,
                data_venda: dataCadastro,
                forma_pagamento:forma_pagamento,
                valor: valor,
            })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Erro ao editar Venda: ${response.status} - ${errorMessage}`);
        }

        
        toast("success", "Venda editada com sucesso!");
        ListaVenda(); 
        modal.style.display = 'none'; 
    } catch (error) {
        console.error('Erro ao editar a Venda:', error);
        toast("error", "Erro ao editar a Venda");
    }
};

        document.addEventListener('DOMContentLoaded', ListaVenda);
        document.getElementById('closeModal').onclick = function() {
        document.getElementById('editarVendaModal').style.display = 'none';
    }
}

async function excluirVenda(element) {
    let id = element.getAttribute('data-id');

    
    const confirmacao = confirm("Tem certeza que deseja excluir esta venda?");
    if (!confirmacao) {
        return;
    }

    try {
        
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Venda/remover-venda/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao excluir venda: ${response.status} - ${errorMessage}`);
        }

        toast("success", "venda excluída com sucesso!");
       

    } catch (error) {
        console.error('Erro ao excluir venda:', error);
        toast("error", "Erro ao excluir a venda. Tente novamente.");
    }

    ListaProduto(); 
}

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
        
 