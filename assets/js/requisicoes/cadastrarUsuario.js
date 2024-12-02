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
            window.location.href = "estoque.html"; // Redireciona após sucesso
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Ocorreu um erro ao tentar cadastrar o estoque.");
        });
}

// Adiciona o evento de submissão ao formulário
document.querySelector(".cadastro-form").addEventListener("submit", cadastrarEstoque);

async function editarUsuario(element) {

    let id = element.getAttribute('data-id');
    // Abre o modal para editar o usuário
    const modal = document.getElementById('editarUsuarioModal');
    const nomeInput = document.getElementById('nomeUsuario');
    const loginInput = document.getElementById('loginUsuario');
    const ehAdmInput = document.getElementById('ehAdmUsuario');
    
    // Mostra o modal
    modal.style.display = 'block';

    // Preenche os campos com os dados do usuário selecionado
    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/buscar-usuario-por-id/${id}`);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao buscar usuário: ${response.status} - ${errorMessage}`);
        }

        const usuario = await response.json();
        nomeInput.value = usuario.nomeUsuario || '';
        loginInput.value = usuario.login || '';
        ehAdmInput.checked = usuario.ehAdm === 1;

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        alert('Erro ao buscar os dados do usuário. Tente novamente.');
        modal.style.display = 'none';
        return;
    }

    // Remove event listener duplicado antes de adicionar novamente
    const salvarEdicaoButton = document.getElementById('salvarEdicao');
    salvarEdicaoButton.onclick = async () => {
        const nomeUsuario = nomeInput.value.trim();
        const login = loginInput.value.trim();
        const ehAdm = ehAdmInput.checked ? 1 : 0;

        // Valida os campos antes de enviar
        if (!nomeUsuario || !login) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/atualizar-usuario`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idUsuario: id,
                    nomeUsuario: nomeUsuario,
                    ehAdm: ehAdm,
                    login: login
                })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erro ao editar usuário: ${response.status} - ${errorMessage}`);
            }

            alert('Usuário editado com sucesso!');
            fetchUsuarios(); // Atualiza a lista de usuários
            modal.style.display = 'none'; // Fecha o modal após sucesso

        } catch (error) {
            console.error('Erro ao editar usuário:', error);
            alert('Você precisa alterar todos os dados para editar o usuário.');
        }
    };
}

async function excluirUsuario(element) {
    let id = element.getAttribute('data-id');

    // Confirmação antes de excluir o usuário
    const confirmacao = confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmacao) {
        return;
    }

    try {
        // Realiza a requisição DELETE para a API
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/remover-usuario/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao excluir usuário: ${response.status} - ${errorMessage}`);
        }

        alert('Usuário excluído com sucesso!');
        fetchUsuarios(); // Atualiza a lista de usuários na interface

    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir o usuário. Tente novamente.');
    }
}

