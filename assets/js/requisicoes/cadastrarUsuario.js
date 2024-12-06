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

let usuarioString = sessionStorage.getItem("DadosUsuario");
let usuario = JSON.parse(usuarioString);

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
                toast('error', 'Ocorreu um erro ao tentar cadastrar o usuário.');
            }
        })
        .then(data => {
            toast('success', 'Usuário cadastrado com sucesso!');
        })
        .catch(error => {
            console.error('Erro:', error);
            toast('error', 'Ocorreu um erro ao tentar cadastrar o usuário.');
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
            console.error(`Erro ao buscar usuário: ${response.status} - ${errorMessage}`);
            toast('error', 'Erro ao buscar usuário.');
        }

        if (usuario.ehAdm !== 1) {
            let ehAdm = document.getElementById('ehAdmUsuario')
            let ehAdmLabel = document.getElementById('ehAdmUsuarioLabel')
            ehAdm.value = 0;
            ehAdm.style.display = 'none';
            ehAdmLabel.style.display = 'none';
        }

        const usuarioSelecionado = await response.json();
        nomeInput.value = usuarioSelecionado.nomeUsuario || '';
        loginInput.value = usuarioSelecionado.login || '';
        ehAdmInput.value = usuarioSelecionado.ehAdm ? '1' : '3';

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        toast('error', 'Erro ao buscar usuário.');
        modal.style.display = 'none';
        return;
    }

    const salvarEdicaoButton = document.getElementById('salvarEdicao');
    salvarEdicaoButton.onclick = async () => {
        const nomeUsuario = nomeInput.value.trim();
        const login = loginInput.value.trim();
        const ehAdm = ehAdmInput.value === null ? 3 : parseInt(ehAdmInput.value);

        if (!nomeUsuario && !login && !ehAdm) {
            toast("error", 'Por favor, altere algum dos campos.');
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
                console.error(`Erro ao editar usuário: ${response.status} - ${errorMessage}`);
                toast('error', 'Erro ao editar usuário.');
            } else {
                toast('success', 'Usuário editado com sucesso!');
                fetchUsuarios();
                modal.style.display = 'none';
            }

        } catch (error) {
            console.error('Erro ao editar usuário:', error);
            toast('error', 'Erro ao editar usuário.');
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
            console.error(`Erro ao excluir usuário: ${response.status} - ${errorMessage}`);
        }

        alert('Usuário excluído com sucesso!');
        fetchUsuarios();

    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        toast('error', 'Erro ao excluir usuário.');
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
            console.error(`Erro ao acessar API: ${resposta.status}`);
            toast('error', 'Erro ao buscar usuário.');
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
        toast('error', 'Erro ao buscar usuário.');
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
            console.error(`Network response was not ok: ${response.status} - ${errorMessage}`);
            toast('error', 'Erro ao buscar usuários.');
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
            toast('error', 'Erro ao buscar usuários.');
        }
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        toast('error', 'Erro ao buscar usuários.');
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
    document.addEventListener('DOMContentLoaded', fetchUsuarios)
}


function verificaPermissao() {
    const usuario = JSON.parse(sessionStorage.getItem("DadosUsuario"));
    if (usuario.ehAdm !== 1) {
        let ehAdm = document.getElementById('ehAdm')
        ehAdm.disabled = true;
        let ehAdmEditar = document.getElementById('ehAdmUsuario')
        ehAdmEditar.style.display = 'none';
    }
}

window.onload = verificaPermissao;
