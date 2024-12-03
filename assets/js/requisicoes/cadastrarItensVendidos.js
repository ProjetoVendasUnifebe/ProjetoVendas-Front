function autocomplete(input, data) {
    let currentFocus;

    input.addEventListener("input", function (e) {
        let list, item, val = this.value;
        closeAllLists();
        if (!val) return false;
        currentFocus = -1;

        list = document.createElement("div");
        list.setAttribute("id", this.id + "-autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(list);

        for (let i = 0; i < data.length; i++) {
            if (data[i].toLowerCase().includes(val.toLowerCase())) {
                item = document.createElement("div");
                item.innerHTML = data[i];
                item.addEventListener("click", function (e) {
                    input.value = this.innerText;
                    closeAllLists();
                });
                list.appendChild(item);
            }
        }
    });

    input.addEventListener("keydown", function (e) {
        let list = document.getElementById(this.id + "-autocomplete-list");
        if (list) list = list.getElementsByTagName("div");
        if (e.keyCode === 40) {
            currentFocus++;
            addActive(list);
        } else if (e.keyCode === 38) {
            currentFocus--;
            addActive(list);
        } else if (e.keyCode === 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (list) list[currentFocus].click();
            }
        }
    });

    function addActive(list) {
        if (!list) return false;
        removeActive(list);
        if (currentFocus >= list.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = list.length - 1;
        list[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(list) {
        for (let i = 0; i < list.length; i++) {
            list[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        let items = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < items.length; i++) {
            if (elmnt != items[i] && elmnt != input) {
                items[i].parentNode.removeChild(items[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

async function fetchVendas() {
    try {
        const response = await fetch("https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Venda/buscar-todas-vendas");
        const data = await response.json();
        return data.map(venda => "Venda nº " + venda.idVenda);
    } catch (error) {
        console.log("Error fetching vendas:", error);
        return [];
    }
}

async function fetchProdutos() {
    try {
        const response = await fetch("https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Produto/buscar-todos-produtos");
        const data = await response.json();
        return data.map(produto => produto.nomeProduto + " - " + produto.idProduto);
    } catch (error) {
        console.log("Error fetching produtos:", error);
        return [];
    }
}

async function iniciandoAutocompletes() {
    const vendas = await fetchVendas();
    autocomplete(document.getElementById("autocompleteVenda"), vendas);

    const produtos = await fetchProdutos();
    autocomplete(document.getElementById('autocompleteProduto'), produtos);
}

async function cadastrarItemVendido() {
    const vendaInput = document.getElementById("autocompleteVenda").value;
    const produtoInput = document.getElementById("autocompleteProduto").value;
    const quantidade = document.getElementById("quantidade").value;

    const idVenda = vendaInput.split(" nº ")[1];
    const idProduto = produtoInput.split(" - ")[1];
    console.log(idVenda, idProduto, quantidade);

    const novoItemVendido = {
        idVenda: parseInt(idVenda),
        idProduto: parseInt(idProduto),
        qtdVendida: parseInt(quantidade),
    };

    try {
        const response = await fetch("https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/ItensVendidos/adicionar-itens-vendidos", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoItemVendido)
        });

        if (response.ok) {
            const data = await response.json();
            alert('Cadastro realizado com sucesso!');
            window.location.href = "../Listas/listagemItensVendido.html";
        } else {
            console.log('Erro ao cadastrar item vendido:', response.statusText);
            alert('Erro ao cadastrar item vendido. Tente novamente.');
        }
    } catch (error) {
        console.log('Erro na requisição:', error);
        alert('Erro na requisição. Tente novamente.');
    }
}

async function fetchItensVendidos() {
    try {
        const response = await fetch('https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/ItensVendidos/buscar-todos-itens-vendidos');
        const itensVendidos = await response.json();
        const tbody = document.querySelector('#itens-vendidos-container');
        tbody.innerHTML = '';

        if (Array.isArray(itensVendidos)) {
            itensVendidos.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th scope="row">${item.idItensVendidos}</th>
                    <td>${item.idVenda}</td>
                    <td>${item.idProduto}</td>
                    <td>${item.qtdVendida}</td>
                    <td>
                        <ion-icon name="create-outline" class="button-edit" data-id="${item.idItensVendidos}" onclick="editarItemVendido(this)">Editar</ion-icon>
                        <ion-icon name="trash" class="button-delete" data-id="${item.idItensVendidos}" onclick="excluirItemVendido(this)">Apagar</ion-icon>
                    </td>
                `;
                tbody.appendChild(row);
            });

            substituirIDPorNomeVenda();
            substituirIDPorNomeProduto();
        } else {
            console.error('A resposta não é um array:', itensVendidos);
        }
    } catch (error) {
        console.error('Erro ao buscar itens vendidos:', error);
        alert('Erro ao carregar itens vendidos. Tente novamente mais tarde.');
    }
}

if (window.location.pathname.includes('listagemItensVendidos.html')) {//IF necessário para a página rodar(depois separar em arquivos diferentes)
    document.getElementById('closeModal').onclick = function () {
        document.getElementById('editarItemVendidoModal').style.display = 'none';
    }
}

async function substituirIDPorNomeVenda() {
    const linhasTabela = document.querySelectorAll('#itens-vendidos-container tr');

    for (let linha of linhasTabela) {
        const celulaVenda = linha.querySelector('td:nth-child(2)');
        const idVenda = celulaVenda.textContent.trim();

        if (idVenda) {
            const dadosVenda = await fetchVendaByID(idVenda);
            if (dadosVenda && dadosVenda.dataVenda) {
                celulaVenda.textContent = "Venda nº " + dadosVenda.idVenda;
            }
        }
    }
}

async function substituirIDPorNomeProduto() {
    const linhasTabela = document.querySelectorAll('#itens-vendidos-container tr');

    for (let linha of linhasTabela) {
        const celulaProduto = linha.querySelector('td:nth-child(3)');
        const idProduto = celulaProduto.textContent.trim();

        if (idProduto) {
            const dadosProduto = await fetchProdutoByID(idProduto);
            if (dadosProduto && dadosProduto.nomeProduto) {
                celulaProduto.textContent = dadosProduto.nomeProduto;
            }
        }
    }
}

async function fetchVendaByID(id) {
    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Venda/buscar-venda-por-id/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar venda: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar venda:', error);
    }
}

async function fetchProdutoByID(id) {
    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Produto/buscar-produto-por-id/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar produto: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
    }
}

async function editarItemVendido(element) {
    let id = element.getAttribute('data-id');

    const modal = document.getElementById('editarItemVendidoModal');
    const vendaInput = document.getElementById('autocompleteVenda');
    const produtoInput = document.getElementById('autocompleteProduto');
    const quantidadeInput = document.getElementById('quantidade');

    modal.style.display = 'block';
    iniciandoAutocompletes();

    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/ItensVendidos/buscar-itens-vendidos-por-id/${id}`);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao buscar item vendido: ${response.status} - ${errorMessage}`);
        }

        const itemVendido = await response.json();
        const venda = await fetchVendaByID(itemVendido.idVenda);
        const produto = await fetchProdutoByID(itemVendido.idProduto);
        vendaInput.value = `Venda nº ${venda.idVenda}` || '';
        produtoInput.value = `${produto.nomeProduto} - ${itemVendido.idProduto}` || '';
        quantidadeInput.value = itemVendido.qtdVendida || '';

    } catch (error) {
        console.error('Erro ao buscar item vendido:', error);
        alert('Erro ao buscar os dados do item vendido. Tente novamente.');
        modal.style.display = 'none';
        return;
    }

    const salvarEdicaoButton = document.getElementById('salvarItemVendidoEdicao');
    salvarEdicaoButton.onclick = async () => {
        const vendaValue = vendaInput.value.trim();
        const produtoValue = produtoInput.value.trim();
        const quantidade = quantidadeInput.value.trim();

        if (!vendaValue || !produtoValue || !quantidade) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const idVenda = vendaValue.split(" nº ")[1];
        const idProduto = produtoValue.split(" - ")[1];

        try {
            const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/ItensVendidos/atualizar-itens-vendidos`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idItensVendidos: parseInt(id),
                    idVenda: parseInt(idVenda),
                    idProduto: parseInt(idProduto),
                    qtdVendida: parseInt(quantidade)
                })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erro ao editar item vendido: ${response.status} - ${errorMessage}`);
            }
            // Toastify({
            //     text: "Item vendido editado com sucesso!",
            //     className: "info",
            //     style: {
            //       background: "linear-gradient(to right,  #711e92, #5b087c)",
            //     }
            //   }).showToast();
            alert('Item vendido editado com sucesso!');
            fetchItensVendidos();
            modal.style.display = 'none';
        } catch (error) {
            console.error('Erro ao editar item vendido:', error);
            alert('Erro ao editar item vendido. Tente novamente.');
        }
    };
}

async function excluirItemVendido(element) {
    let id = element.getAttribute('data-id');

    if (!confirm('Tem certeza que deseja excluir este item vendido?')) {
        return;
    }

    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/ItensVendidos/remover-itens-vendidos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao excluir item vendido: ${response.status} - ${errorMessage}`);
        }
        // Toastify({
        //     text: "Item vendido excluído com sucesso!",
        //     className: "info",
        //     style: {
        //       background: "linear-gradient(to right,  #711e92, #5b087c)",
        //     }
        //   }).showToast();
        alert('Item vendido excluído com sucesso!');
        fetchItensVendidos();
    }
    catch (error) {
        console.error('Erro ao excluir item vendido:', error);
        alert('Erro ao excluir item vendido. Tente novamente.');
    }
}

async function pesquisarEstoque() {
    const pesquisaInput = document.getElementById('pesquisaEstoque').value.trim();
    const filtro = document.getElementById('filtroEstoque').value;

    if (!pesquisaInput) {
        fetchItensVendidos();
        return;
    }

    let url;

    if (filtro === 'id') {
        if (!isNaN(pesquisaInput)) {
            url = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/ItensVendidos/buscar-itens-vendidos-por-id/${pesquisaInput}`;
        } else {
            alert('Por favor, insira um ID válido.');
            return;
        }
    }

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error(`Erro ao acessar API: ${resposta.status}`);
        }

        const itensVendidos = await resposta.json();
        const tbody = document.querySelector('#itens-vendidos-container');
        tbody.innerHTML = '';

        if (!itensVendidos || itensVendidos.length === 0) {
            alert('Nenhum item vendido encontrado.');
            return;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row">${itensVendidos.idItensVendidos}</th>
            <td>${itensVendidos.idVenda}</td>
            <td>${itensVendidos.idProduto}</td>
            <td>${itensVendidos.qtdVendida}</td>
            <td>
                <ion-icon name="create-outline" class="button-edit" data-id="${itensVendidos.idItensVendidos}" onclick="editarItemVendido(this)">Editar</ion-icon>
                <ion-icon name="trash" class="button-delete" data-id="${itensVendidos.idItensVendidos}" onclick="excluirItemVendido(this)">Apagar</ion-icon>
            </td>`;
        tbody.appendChild(row);

        substituirIDPorNomeVenda();
        substituirIDPorNomeProduto();
    } catch (erro) {
        console.error('Erro ao buscar item vendido:', erro);
        alert('Erro ao buscar item vendido.');
    }
}

window.onload = iniciandoAutocompletes;
if (window.location.pathname.includes('listagemItensVendidos.html')) {
    window.onload = fetchItensVendidos;
}   
