async function fetchClientes() {
    try {
        const response = await fetch('https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Cliente/buscar-todos-clientes');
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao buscar clientes: ${response.status} - ${errorMessage}`);
        }

        const clientes = await response.json();
        const tbody = document.querySelector('#clientes-container');
        tbody.innerHTML = '';

        if (Array.isArray(clientes)) {
            clientes.forEach(cliente => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th scope="row">${cliente.idCliente}</th>
                    <td>${cliente.nome}</td>
                    <td>${cliente.cpf}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.sexo}</td>
                    <td>${cliente.idEndereco}</td>
                    <td>
                        <ion-icon name="create-outline" class="button-edit" data-id="${cliente.idCliente}" onclick="editarCliente(this)">Editar</ion-icon> 
                        <ion-icon name="trash" class="button-delete" data-id="${cliente.idCliente}" onclick="excluirCliente(this)">Apagar</ion-icon>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } else {
            console.error('A resposta não é um array:', clientes);
        }
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        alert('Erro ao carregar clientes. Tente novamente mais tarde.');
    }
}

if (window.location.pathname.includes('listagemCliente.html')) {
    document.getElementById('closeModal').onclick = function () {
        document.getElementById('editarClienteModal').style.display = 'none';
    }
}


async function editarCliente(element) {
    let id = element.getAttribute('data-id');
    const modal = document.getElementById('editarClienteModal');
    const nomeInput = document.getElementById('nomeCliente');
    const cpfInput = document.getElementById('cpfCliente');
    const emailInput = document.getElementById('emailCliente');
    const telefoneInput = document.getElementById('telefoneCliente');
    const sexoInput = document.getElementById('sexoCliente');
    const enderecoInput = document.getElementById('enderecoCliente');

    modal.style.display = 'block';

    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Cliente/buscar-cliente-por-id/${id}`);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao buscar cliente: ${response.status} - ${errorMessage}`);
        }

        const cliente = await response.json();
        nomeInput.value = cliente.nome;
        cpfInput.value = cliente.cpf;
        emailInput.value = cliente.email;
        telefoneInput.value = cliente.telefone;
        sexoInput.value = cliente.sexo;
        enderecoInput.value = cliente.idEndereco;
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        alert('Erro ao carregar cliente. Tente novamente mais tarde.');
        modal.style.display = 'none';
        return;
    }

    const salvarEdicaoButton = document.getElementById('salvarEdicaoCliente');
    salvarEdicaoButton.onclick = async () => {
        const nome = nomeInput.value.trim();
        const cpf = cpfInput.value.trim();
        const email = emailInput.value.trim();
        const telefone = telefoneInput.value.trim();
        const sexo = sexoInput.value.trim();
        const endereco = enderecoInput.value.trim();

        if (!nome || !cpf || !email || !telefone || !sexo || !endereco) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Cliente/atualizar-cliente`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idCliente: id,
                    nome,
                    cpf,
                    email,
                    telefone,
                    sexo,
                    idEndereco: endereco,
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erro ao editar cliente: ${response.status} - ${errorMessage}`);
            }

            alert('Cliente editado com sucesso!');
            fetchClientes();
            modal.style.display = 'none';

        } catch (error) {
            console.error('Erro ao editar cliente:', error);
            alert('Erro ao editar o cliente. Tente novamente.');
        }

    }

}

async function excluirCliente(element) {
    let id = element.getAttribute('data-id');
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
        return;
    }

    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Cliente/remover-cliente/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao excluir cliente: ${response.status} - ${errorMessage}`);
        }

        alert('Cliente excluído com sucesso!');
        fetchClientes();

    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        alert('Erro ao excluir o cliente. Tente novamente.');
    }
}

if (window.location.pathname.includes('listagemCliente.html')) {
    window.onload = fetchClientes;
}