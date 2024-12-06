async function fetchClientes() {
    try {
        const response = await fetch('https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Cliente/buscar-todos-clientes');
        if (!response.ok) {
            const errorMessage = await response.text();
           console.error(`Erro ao buscar clientes: ${response.status} - ${errorMessage}`);
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
        toast('error','Erro ao carregar clientes. Tente novamente mais tarde.');
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
           console.error(`Erro ao buscar cliente: ${response.status} - ${errorMessage}`);
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
        toast('error','Erro ao carregar cliente. Tente novamente mais tarde.');
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
            toast('error','Por favor, preencha todos os campos.');
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
                console.error(`Erro ao editar cliente: ${response.status} - ${errorMessage}`);
            }

            toast("success",'Cliente editado com sucesso!');
            fetchClientes();
            modal.style.display = 'none';

        } catch (error) {
            console.error('Erro ao editar cliente:', error);
            toast('error','Erro ao editar o cliente. Tente novamente.');
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
            console.error(`Erro ao excluir cliente: ${response.status} - ${errorMessage}`);
        }

        toast('success','Cliente excluído com sucesso!');
        fetchClientes();

    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        toast('error','Erro ao excluir o cliente. Tente novamente.');
    }
}

async function pesquisarCliente() {
    const pesquisaInput = document.getElementById('pesquisaCliente').value.trim();
    const filtro = document.getElementById('filtroCliente').value;

    if (!pesquisaInput) {
        fetchClientes();
        return;
    }

    let url;

    if (filtro === 'id') {
        if (!isNaN(pesquisaInput)) {
            url = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Cliente/buscar-cliente-por-id/${pesquisaInput}`;
        } else {
            toast('error','Por favor, insira um ID válido.');
            return;
        }
    } else if (filtro === 'nome') {
        url = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Cliente/buscar-cliente-por-nome/${encodeURIComponent(pesquisaInput)}`;
    }

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            console.error(`Erro ao acessar API: ${resposta.status}`);
        }

        const clientes = await resposta.json();
        const tbody = document.querySelector('#clientes-container');
        tbody.innerHTML = '';

        if (!clientes || clientes.length === 0) {
            toast('error','Nenhum cliente encontrado.');
            return;
        }

        if (filtro === 'nome') {
            pesquisarClienteNome(clientes);
        } else {
            pesquisarClienteId(clientes);
        }
    } catch (erro) {
        console.error('Erro ao buscar cliente:', erro);
        toast('error','Erro ao buscar cliente.');
    }
}

async function pesquisarClienteId(clientes) {
    const tbody = document.querySelector('#clientes-container');
    const row = document.createElement('tr');
    row.innerHTML = `
    <th scope="row">${clientes.idCliente}</th>
    <td>${clientes.nome}</td>
    <td>${clientes.cpf}</td>
    <td>${clientes.email}</td>
    <td>${clientes.telefone}</td>
    <td>${clientes.sexo}</td>
    <td>${clientes.idEndereco}</td>
    <td>
        <ion-icon name="create-outline" class="button-edit" data-id="${clientes.idCliente}" onclick="editarCliente(this)">Editar</ion-icon>
        <ion-icon name="trash" class="button-delete" data-id='${clientes.idCliente}' onclick="excluirCliente(this)">Apagar</ion-icon>
    </td>`;
    tbody.appendChild(row);
}

async function pesquisarClienteNome(clientes) {
    const tbody = document.querySelector('#clientes-container');
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
            <ion-icon name="trash" class="button-delete" data-id='${cliente.idCliente}' onclick="excluirCliente(this)">Apagar</ion-icon>
        </td>`;
        tbody.appendChild(row);
    });
}

if (window.location.pathname.includes('listagemCliente.html')) {
    window.onload = fetchClientes;
}