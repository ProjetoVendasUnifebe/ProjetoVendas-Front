function cadastrarUsuario() {
    const url = 'https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/cadastrar-usuario';

    const nomeUsuario = document.getElementById("nomeUsuario").value;
    const senha = document.getElementById("senhaUsuario").value;
    const confSenha = document.getElementById("confSenhaUsuario").value;
    const ehAdm = parseInt(document.getElementById("ehAdm").value);
    const login = document.getElementById("login").value;

    if (senha !== confSenha) {
        document.getElementById("popup").style.display = "block";
        return;
    }

    const dadosUsuario = {
        nomeUsuario: nomeUsuario,
        senha: senha,
        ehAdm: ehAdm,
        login: login
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosUsuario)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro ao cadastrar usuário');
            }
        })
        .then(data => {
            console.log('Usuário cadastrado com sucesso:', data);
            alert("Usuário cadastrado com sucesso!");
        })
        .catch(error => {
            console.error('Erro:', error);
            alert("Ocorreu um erro ao tentar cadastrar o usuário.");
        });
}
if (window.location.pathname.includes('cadastrarUsuario.html')) {
    document.getElementById("ok-btn").addEventListener("click", function () {
        document.getElementById("popup").style.display = "none";
    });
}

async function editarUsuario(element) {

    let id = element.getAttribute('data-id');
    const modal = document.getElementById('editarUsuarioModal');
    const nomeInput = document.getElementById('nomeUsuario');
    const loginInput = document.getElementById('loginUsuario');
    const ehAdmInput = document.getElementById('ehAdmUsuario');

    modal.style.display = 'block';

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

    const salvarEdicaoButton = document.getElementById('salvarEdicao');
    salvarEdicaoButton.onclick = async () => {
        const nomeUsuario = nomeInput.value.trim();
        const login = loginInput.value.trim();
        const ehAdm = ehAdmInput.checked ? 1 : 0;

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
            fetchUsuarios();
            modal.style.display = 'none';

        } catch (error) {
            console.error('Erro ao editar usuário:', error);
            alert('Você precisa alterar todos os dados para editar o usuário.');
        }
    };
}

async function excluirUsuario(element) {
    let id = element.getAttribute('data-id');

    const confirmacao = confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmacao) {
        return;
    }

    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/remover-usuario/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao excluir usuário: ${response.status} - ${errorMessage}`);
        }

        alert('Usuário excluído com sucesso!');
        fetchUsuarios();

    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir o usuário. Tente novamente.');
    }
}

async function pesquisarUsuario() {
    const pesquisaInput = document.getElementById('pesquisaUsuario').value.trim();
    const filtro = document.getElementById('filtroUsuario').value;

    if (!pesquisaInput) {
        fetchUsuarios();
        return;
    }

    let url;

    if (filtro === 'id') {
        if (!isNaN(pesquisaInput)) {
            url = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/buscar-usuario-por-id/${pesquisaInput}`;
        } else {
            lista.textContent = 'Por favor, insira um ID válido.';
            return;
        }
    } else if (filtro === 'nome') {
        url = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/buscar-usuario-por-nome/${encodeURIComponent(pesquisaInput)}`;
    }
    else if (filtro === 'login') {
        url = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/buscar-usuario-por-login/${encodeURIComponent(pesquisaInput)}`;
    }

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error(`Erro ao acessar API: ${resposta.status}`);
        }

        const usuarios = await resposta.json();
        const tbody = document.querySelector('#usuarios-container');
        tbody.innerHTML = '';

        if (!usuarios || usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">Nenhum usuário encontrado.</td></tr>';
            return;
        }

        if (filtro === 'nome') {
            pesquisarUsuarioNome(usuarios);
        }
        else if (filtro === 'login') {
            pesquisarUsuarioPorLogin(usuarios);
        }
        else {
            pesquisarUsuarioId(usuarios);
        }
    } catch (erro) {
        console.error('Erro ao buscar usuário:', erro);
    }
}

async function pesquisarUsuarioId(usuario) {
    const tbody = document.querySelector('#usuarios-container');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${usuario.idUsuario}</td>
        <td> ${usuario.nomeUsuario}</td>
        <td>${usuario.login}</td>
        <td>${usuario.ehAdm ? 'Sim' : 'Não'}</td>
        <td>
            <ion-icon name="create-outline" class="button-edit" data-id="${usuario.idUsuario}" onclick="editarUsuario(this)">Editar</ion-icon>
            <ion-icon name="trash" class="button-delete" data-id='${usuario.idUsuario}' onclick="excluirUsuario(this)">Apagar</ion-icon>
        </td>
    `;
    tbody.appendChild(row);
}

async function pesquisarUsuarioNome(usuarios) {
    const tbody = document.querySelector('#usuarios-container');
    usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${usuario.idUsuario}</td>
            <td>${usuario.nomeUsuario}</td>
            <td>${usuario.login}</td>
            <td>${usuario.ehAdm ? 'Sim' : 'Não'}</td>
            <td>
                <ion-icon name="create-outline" class="button-edit" data-id="${usuario.idUsuario}" onclick="editarUsuario(this)">Editar</ion-icon>
                <ion-icon name="trash" class="button-delete" data-id='${usuario.idUsuario}' onclick="excluirUsuario(this)">Apagar</ion-icon>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function pesquisarUsuarioPorLogin(usuario) {
    const tbody = document.querySelector('#usuarios-container');

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${usuario.idUsuario}</td>
        <td> ${usuario.nomeUsuario}</td>
        <td>${usuario.login}</td>
        <td>${usuario.ehAdm ? 'Sim' : 'Não'}</td>
        <td>
            <ion-icon name="create-outline" class="button-edit" data-id="${usuario.idUsuario}" onclick="editarUsuario(this)">Editar</ion-icon>
            <ion-icon name="trash" class="button-delete" data-id='${usuario.idUsuario}' onclick="excluirUsuario(this)">Apagar</ion-icon>
        </td>
    `;
    tbody.appendChild(row);
}

async function fetchUsuarios() {
    try {
        const response = await fetch('https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Usuario/buscar-todos-usuarios');

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Network response was not ok: ${response.status} - ${errorMessage}`);
        }

        const usuarios = await response.json();
        const tbody = document.querySelector('#usuarios-container');

        tbody.innerHTML = '';

        if (Array.isArray(usuarios)) {
            usuarios.forEach(usuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th scope="row">${usuario.idUsuario}</th>
                    <td>${usuario.nomeUsuario}</td>
                    <td>${usuario.login}</td>
                    <td>${usuario.ehAdm == 1 ? 'Sim' : 'Não'}</td>
                    <td>
                        <ion-icon name="create-outline" class="button-edit" data-id="${usuario.idUsuario}" onclick="editarUsuario(this)">Editar</ion-icon> 
                        <ion-icon name="trash" class="button-delete" data-id="${usuario.idUsuario}" onclick="excluirUsuario(this)">Apagar</ion-icon>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } else {
            console.error('A resposta não é um array:', usuarios);
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

if (window.location.pathname.includes('listagemUsuario.html')) {
    document.getElementById('closeModal').onclick = function () {
        document.getElementById('editarUsuarioModal').style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == document.getElementById('editarUsuarioModal')) {
            document.getElementById('editarUsuarioModal').style.display = 'none';
        }
    }
}

if (window.location.pathname.includes('listagemUsuario.html')) {
    window.onload = fetchUsuarios;
}

