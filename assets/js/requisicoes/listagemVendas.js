
const baseUrl = 'https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Venda';

const lista = document.getElementById('lista-produtos');
// Função para listar todos os produtos

    function formatarData(data){

        // Convertendo a data para o formato brasileiro
            let dataFormatada = new Date(data).toLocaleDateString("pt-BR");

            // Formatando a hora para o padrão 24 horas (opcional)
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
            throw new Error(`Erro ao acessar API: ${resposta.status}`);
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

    // Construir URL para buscar a venda pelo ID
    const url = `${baseUrl}/buscar-venda-por-id/${pesquisaInput}`;

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error(`Erro ao acessar API: ${resposta.status}`);
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
    //const pesquisaInput = document.getElementById('pesquisadata').value.trim();

    const dataInicioInput = document.getElementById('dataInicio').value.trim();
    const dataFimInput = document.getElementById('dataFim').value.trim();

     // Se ambos os campos estiverem vazios, busca todas as vendas
     if (!dataInicioInput && !dataFimInput) {
        ListaVenda();
        return;
    }

    // Construir URL para buscar a venda pelo ID
    let url = `${baseUrl}/buscar-vendas-por-data`;

     // Se ambos os campos de data forem preenchidos, inclui ambos na URL
     if (dataInicioInput && dataFimInput) {
        url += `?dataInicio=${dataInicioInput}&dataFim=${dataFimInput}`;
    } else if (dataInicioInput) {
        // Se somente a data de início for fornecida
        url += `?dataInicio=${dataInicioInput}`;
    } else if (dataFimInput) {
        // Se somente a data de fim for fornecida
        url += `?dataFim=${dataFimInput}`;
    }

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error(`Erro ao acessar API: ${resposta.status}`);
        }

        const vendas = await resposta.json();
        const tbody = document.querySelector('#vendas-container');
        
        tbody.innerHTML = ''; // Limpar lista antes de preencher

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

// Carregar todos os produtos inicialmente
ListaVenda();

    

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function editarVenda(element) {

let id = element.getAttribute('data-id');
// Abre o modal para editar o usuário
const modal = document.getElementById('editarVendaModal');
const IdUsuarioInput = document.getElementById('IdUsuario');
const IdClienteInput = document.getElementById('IdCliente');
const dataCadastroInput = document.getElementById('dataCadastro');
const forma_pagamentoInput = document.getElementById('forma_pagamento');
const ValorInput = document.getElementById('Valor');


// Mostra o modal
modal.style.display = 'block';

// Preenche os campos com os dados da venda selecionado
console.log(id)
try {
    const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Venda/buscar-venda-por-id/${id}`);
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erro ao buscar venda: ${response.status} - ${errorMessage}`);
    }

    const venda = await response.json();
    IdUsuarioInput.value = venda.idUsuario || '';
    IdClienteInput.value = venda.idCliente || '';
    dataCadastroInput.value = venda.data_venda || '';
    forma_pagamentoInput.value = venda.forma_pagamento || '';
    ValorInput.value = venda.valor || '';
   
} catch (error) {
    console.error('Erro ao buscar Venda:', error);
    alert('Erro ao buscar os dados da Venda. Tente novamente.');
    modal.style.display = 'none';
    return;
}

// Remove event listener duplicado antes de adicionar novamente
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
            throw new Error(`Erro ao editar Venda: ${response.status} - ${errorMessage}`);
        }

        alert('Venda editada com sucesso!');
        ListaVenda(); // Atualiza a lista de usuários
        modal.style.display = 'none'; // Fecha o modal após sucesso

    } catch (error) {
        console.error('Erro ao editar a Venda:', error);
        alert('Você precisa alterar todos os dados para editar o produto.');
    }
};

        document.addEventListener('DOMContentLoaded', ListaVenda);
        document.getElementById('closeModal').onclick = function() {
        document.getElementById('editarVendaModal').style.display = 'none';
    }
}

async function excluirVenda(element) {
    let id = element.getAttribute('data-id');

    // Confirmação antes de excluir o usuário
    const confirmacao = confirm("Tem certeza que deseja excluir esta venda?");
    if (!confirmacao) {
        return;
    }

    try {
        // Realiza a requisição DELETE para a API
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Venda/remover-venda/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao excluir venda: ${response.status} - ${errorMessage}`);
        }

        alert('venda excluída com sucesso!');
       

    } catch (error) {
        console.error('Erro ao excluir venda:', error);
        alert('Erro ao excluir a venda. Tente novamente.');
    }

    ListaProduto(); // Atualiza a lista de usuários na interface
}

        
 