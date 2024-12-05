async function fetchEstoques() {
    try {
        const response = await fetch('https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque/buscar-todos-estoques');
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao buscar estoques: ${response.status} - ${errorMessage}`);
        }

        const estoques = await response.json();
        const tbody = document.querySelector('#estoques-container');
        tbody.innerHTML = '';

        if (Array.isArray(estoques)) {
            estoques.forEach(estoque => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th scope="row">${estoque.idEstoque}</th>
                    <td>${estoque.nome}</td>
                    <td>${estoque.capacidade}</td>
                    <td>
                        <ion-icon name="create-outline" class="button-edit" data-id="${estoque.idEstoque}" onclick="editarEstoque(this)">Editar</ion-icon> 
                        <ion-icon name="trash" class="button-delete" data-id="${estoque.idEstoque}" onclick="excluirEstoque(this)">Apagar</ion-icon>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } else {
            console.error('A resposta não é um array:', estoques);
        }
    } catch (error) {
        console.error('Erro ao buscar estoques:', error);
        alert('Erro ao carregar estoques. Tente novamente mais tarde.');
    }
}

if (window.location.pathname.includes('listagemEstoque.html')) {
    document.getElementById('closeModal').onclick = function () {
        document.getElementById('editarEstoqueModal').style.display = 'none';
    }
}


window.onclick = function (event) {
    if (event.target == document.getElementById('editarEstoqueModal')) {
        document.getElementById('editarEstoqueModal').style.display = 'none';
    }
}

function cadastrarEstoque(event) {
    event.preventDefault();

    const url = 'https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque/adicionar-estoque';

    const nome = document.getElementById("nome").value.trim();
    const capacidade = parseInt(document.getElementById("capacidade").value, 10);

    if (!nome || isNaN(capacidade) || capacidade <= 0) {
        alert("Por favor, preencha os campos corretamente.");
        return;
    }

    const dadosEstoque = {
        nome: nome,
        capacidade: capacidade
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosEstoque)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro ao cadastrar o estoque.');
            }
        })
        .then(data => {
            alert("Estoque cadastrado com sucesso!");
            console.log("Resposta da API:", data);
            window.location.href = "../Listas/listagemEstoque.html";
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Ocorreu um erro ao tentar cadastrar o estoque.");
        });
}

// document.querySelector(".cadastro-form").addEventListener("submit", cadastrarEstoque);

async function editarEstoque(element) {
    const id = element.getAttribute('data-id');
    const modal = document.getElementById('editarEstoqueModal');
    const nomeInput = document.getElementById('nomeEstoque');
    const capacidadeInput = document.getElementById('capacidadeEstoque');

    modal.style.display = 'block';

    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque/buscar-estoque-por-id/${id}`);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao buscar estoque: ${response.status} - ${errorMessage}`);
        }

        const estoque = await response.json();
        nomeInput.value = estoque.nome || '';
        capacidadeInput.value = estoque.capacidade || '';

    } catch (error) {
        console.error('Erro ao buscar estoque:', error);
        alert('Erro ao buscar os dados do estoque. Tente novamente.');
        modal.style.display = 'none';
        return;
    }

    const salvarEdicaoButton = document.getElementById('salvarEstoqueEdicao');
    salvarEdicaoButton.onclick = async () => {
        const nomeEstoque = nomeInput.value.trim();
        const capacidade = parseInt(capacidadeInput.value.trim(), 10);

        if (!nomeEstoque || isNaN(capacidade) || capacidade <= 0) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        try {
            const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque/atualizar-estoque`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idEstoque: id,
                    nome: nomeEstoque,
                    capacidade: capacidade,
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erro ao editar estoque: ${response.status} - ${errorMessage}`);
            }

            alert('Estoque editado com sucesso!');
            fetchEstoques();
            modal.style.display = 'none';

        } catch (error) {
            console.error('Erro ao editar estoque:', error);
            alert('Erro ao editar o estoque. Tente novamente.');
        }
    };
}

async function excluirEstoque(element) {
    let id = element.getAttribute('data-id');

    const confirmacao = confirm("Tem certeza que deseja excluir este estoque?");
    if (!confirmacao) {
        return;
    }

    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque/remover-estoque/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao excluir estoque: ${response.status} - ${errorMessage}`);
        }

        alert('Estoque excluído com sucesso!');
        fetchEstoques();

    } catch (error) {
        console.error('Erro ao excluir estoque:', error);
        alert('Erro ao excluir o estoque. Tente novamente.');
    }
}

async function pesquisarEstoque() {
    const pesquisaInput = document.getElementById('pesquisaEstoque').value.trim();
    const filtro = document.getElementById('filtroEstoque').value;

    if (!pesquisaInput) {
        fetchEstoques();
        return;
    }

    let url;

    if (filtro === 'id') {
        if (!isNaN(pesquisaInput)) {
            url = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque/buscar-estoque-por-id/${pesquisaInput}`;
        } else {
            lista.textContent = 'Por favor, insira um ID válido.';
            return;
        }
    } else if (filtro === 'nome') {
        url = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque/buscar-estoque-por-nome/${encodeURIComponent(pesquisaInput)}`;
    }

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error(`Erro ao acessar API: ${resposta.status}`);
        }

        const estoques = await resposta.json();
        const tbody = document.querySelector('#estoques-container');
        tbody.innerHTML = '';

        if (!estoques || estoques.length === 0) {
            lista.textContent = 'Nenhum estoque encontrado.';
            return;
        }

        if (filtro === 'nome') {
            pesquisarEstoqueNome(estoques);
        } else {
            pesquisarEstoqueId(estoques);
        }
    } catch (erro) {
        console.error('Erro ao buscar estoque:', erro);
        lista.textContent = 'Erro ao buscar estoque.';
    }
}

async function pesquisarEstoqueId(estoques) {
    const tbody = document.querySelector('#estoques-container');
    const row = document.createElement('tr');
    row.innerHTML = `
    <th scope="row">${estoques.idEstoque}</th>
    <td>${estoques.nome}</td>
    <td>${estoques.capacidade}</td>
    <td>
        <ion-icon name="create-outline" class="button-edit" data-id="${estoques.idEstoque}" onclick="editarEstoque(this)">Editar</ion-icon>
        <ion-icon name="trash" class="button-delete" data-id='${estoques.idEstoque}' onclick="excluirEstoque(this)">Apagar</ion-icon>
    </td>`;
    tbody.appendChild(row);
}

async function pesquisarEstoqueNome(estoques) {
    const tbody = document.querySelector('#estoques-container');
    estoques.forEach(estoque => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <th scope="row">${estoque.idEstoque}</th>
        <td>${estoque.nome}</td>
        <td>${estoque.capacidade}</td>
        <td>
            <ion-icon name="create-outline" class="button-edit" data-id="${estoque.idEstoque}" onclick="editarEstoque(this)">Editar</ion-icon>
            <ion-icon name="trash" class="button-delete" data-id='${estoque.idEstoque}' onclick="excluirEstoque(this)">Apagar</ion-icon>
        </td>`;
        tbody.appendChild(row);
    });
}

if (window.location.pathname.includes('listagemEstoque.html')) {
    window.onload = fetchEstoques;
}



