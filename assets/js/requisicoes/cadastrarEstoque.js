function cadastrarEstoque(event) {
    event.preventDefault(); // Evita o recarregamento da página ao enviar o formulário

    const url = 'https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque/adicionar-estoque';

    // Captura os valores dos campos do formulário
    const nome = document.getElementById("nome").value.trim();
    const capacidade = parseInt(document.getElementById("capacidade").value, 10);

    // Validação básica dos dados
    if (!nome || isNaN(capacidade) || capacidade <= 0) {
        alert("Por favor, preencha os campos corretamente.");
        return;
    }

    // Cria o objeto de dados a ser enviado na requisição
    const dadosEstoque = {
        nome: nome,
        capacidade: capacidade
    };

    // Envia a requisição
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
                return response.json(); // Processa a resposta se for bem-sucedida
            } else {
                throw new Error('Erro ao cadastrar o estoque.');
            }
        })
        .then(data => {
            alert("Estoque cadastrado com sucesso!");
            console.log("Resposta da API:", data);
            window.location.href = "../Listas/listagemEstoque.html"; // Redireciona após sucesso
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Ocorreu um erro ao tentar cadastrar o estoque.");
        });
}

// Adiciona o evento de submissão ao formulário
document.querySelector(".cadastro-form").addEventListener("submit", cadastrarEstoque);

async function editarEstoque(element) {
    const id = element.getAttribute('data-id');
    const modal = document.getElementById('editarEstoqueModal');
    const nomeInput = document.getElementById('nomeEstoque');
    const capacidadeInput = document.getElementById('capacidadeEstoque');

    // Exibe o modal para edição
    modal.style.display = 'block';

    // Preenche os campos com os dados do estoque selecionado
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

    // Configura o botão de salvar edição
    const salvarEdicaoButton = document.getElementById('salvarEstoqueEdicao');
    salvarEdicaoButton.onclick = async () => {
        const nomeEstoque = nomeInput.value.trim();
        const capacidade = parseInt(capacidadeInput.value.trim(), 10);

        // Valida os campos antes de enviar
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
            fetchEstoques(); // Atualiza a lista de estoques
            modal.style.display = 'none'; // Fecha o modal após sucesso

        } catch (error) {
            console.error('Erro ao editar estoque:', error);
            alert('Erro ao editar o estoque. Tente novamente.');
        }
    };
}

async function excluirEstoque(element) {
    let id = element.getAttribute('data-id');

    // Confirmação antes de excluir o estoque
    const confirmacao = confirm("Tem certeza que deseja excluir este estoque?");
    if (!confirmacao) {
        return;
    }

    try {
        // Realiza a requisição DELETE para a API
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque/remover-estoque/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao excluir estoque: ${response.status} - ${errorMessage}`);
        }

        alert('Estoque excluído com sucesso!');
        fetchEstoques(); // Atualiza a lista de estoques na interface

    } catch (error) {
        console.error('Erro ao excluir estoque:', error);
        alert('Erro ao excluir o estoque. Tente novamente.');
    }
}