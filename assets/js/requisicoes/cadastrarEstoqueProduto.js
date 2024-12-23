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

async function fetchEstoqueProdutos() {
    try {
        const response = await fetch('https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque_Produto/buscar-todos-estoque-produto');

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Erro ao buscar estoques: ${response.status} - ${errorMessage}`);
        }

        const estoques_produtos = await response.json();
        const tbody = document.querySelector('#estoque-produto-container');
        tbody.innerHTML = '';

        if (Array.isArray(estoques_produtos)) {
            estoques_produtos.forEach(estoque_produto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th scope="row">${estoque_produto.idEstoque_Produto}</th>
                    <td>${estoque_produto.idEstoque}</td>
                    <td>${estoque_produto.idProduto}</td>
                    <td>${estoque_produto.quantidade}</td>
                    <td>
                        <ion-icon name="create-outline" class="button-edit" data-id="${estoque_produto.idEstoque_Produto}" onclick="editarEstoqueProduto(this)">Editar</ion-icon> 
                        <ion-icon name="trash" class="button-delete" data-id="${estoque_produto.idEstoque_Produto}" onclick="excluirEstoque_Produto(this)">Apagar</ion-icon>
                    </td>
                `;
                tbody.appendChild(row);
            });
            substituirIDPorNomeEstoque();
            substituirIDPorNomeProduto()
        } else {
            console.error('A resposta não é um array:', estoques_produtos);
        }
    } catch (error) {
        console.error('Erro ao buscar estoques:', error);
        toast('error','Erro ao carregar estoques. Tente novamente mais tarde.');
    }
}
if (window.location.pathname.includes('listagemEstoqueProduto.html')) {//IF necessário para a página rodar(depois separar em arquivos diferentes)
    document.getElementById('closeModal').onclick = function () {
        document.getElementById('editarEstoqueProdutoModal').style.display = 'none';
    }
}

window.onclick = function (event) {
    if (event.target == document.getElementById('editarEstoqueProdutoModal')) {
        document.getElementById('editarEstoqueProdutoModal').style.display = 'none';
    }
}

async function fetchEstoqueByID(id) {
    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque/buscar-estoque-por-id/${id}`);
        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Erro ao buscar estoque: ${response.status} - ${errorMessage}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar estoque:', error);
        toast('error','Erro ao buscar estoque. Tente novamente.');
    }
}

async function substituirIDPorNomeEstoque() {
    const linhasTabela = document.querySelectorAll('#estoque-produto-container tr');

    for (let linha of linhasTabela) {
        const celulaEstoque = linha.querySelector('td:nth-child(2)');
        const idEstoque = celulaEstoque.textContent.trim();

        if (idEstoque) {
            const dadosEstoque = await fetchEstoqueByID(idEstoque);
            if (dadosEstoque && dadosEstoque.nome) {
                celulaEstoque.textContent = dadosEstoque.nome;
            }
        }
    }
}

async function fetchProdutoByID(id) {
    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Produto/buscar-produto-por-id/${id}`);
        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Erro ao buscar produto: ${response.status} - ${errorMessage}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        toast('error','Erro ao buscar produto. Tente novamente.');
    }
}

async function substituirIDPorNomeProduto() {
    const linhasTabela = document.querySelectorAll('#estoque-produto-container tr');

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

async function fetchStocks() {
    try {
        const response = await fetch("https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque/buscar-todos-estoques");
        const data = await response.json();
        return data.map(stock => stock.nome + " - " + stock.idEstoque);
    } catch (error) {
        console.log("Error fetching stocks:", error);
        return [];
    }
}

async function fetchProducts() {
    try {
        const response = await fetch("https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Produto/buscar-todos-produtos");
        const data = await response.json();
        return data.map(product => product.nomeProduto + " - " + product.idProduto);
    } catch (error) {
        console.log("Error fetching products:", error);
        return [];
    }
}

async function iniciandoAutocompletes() {
    const stocks = await fetchStocks();
    autocomplete(document.getElementById("autocompleteEstoque"), stocks);

    const products = await fetchProducts();
    autocomplete(document.getElementById('autocompleteProduto'), products);
}

async function cadastrarEstoqueProduto() {
    const estoqueInput = document.getElementById("autocompleteEstoque").value;
    const produtoInput = document.getElementById("autocompleteProduto").value;
    const quantidade = document.getElementById("quantidade").value;
    const dataAtualizacao = new Date().toISOString();

    const idEstoque = estoqueInput.split(" - ")[1];
    const idProduto = produtoInput.split(" - ")[1];

    const novoEstoqueProduto = {
        idEstoque: parseInt(idEstoque),
        idProduto: parseInt(idProduto),
        quantidade: parseInt(quantidade),
        dataAtualizacao: dataAtualizacao
    };

    // console.log('Novo estoque-produto:', novoEstoqueProduto);
    try {
        const response = await fetch("https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque_Produto/adicionar-estoque-produto", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoEstoqueProduto)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Cadastro realizado com sucesso:', data);
            toast('success','Cadastro realizado com sucesso!');
            window.location.href = "../Listas/listagemEstoqueProduto.html";
        } else {
            console.log('Erro ao cadastrar estoque-produto:', response.statusText);
            toast('error','Erro ao cadastrar estoque-produto. Tente novamente.');
        }
    } catch (error) {
        console.log('Erro na requisição:', error);
        toast('error','Erro na requisição. Tente novamente.');
    }
}

async function editarEstoqueProduto(element) {
    let id = element.getAttribute('data-id');
    const modal = document.getElementById('editarEstoqueProdutoModal');
    const estoqueInput = document.getElementById('autocompleteEstoque');
    const produtoInput = document.getElementById('autocompleteProduto');
    const quantidadeInput = document.getElementById('quantidade');

    modal.style.display = 'block';
    iniciandoAutocompletes();

    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque_Produto/buscar-estoque-produto-por-id/${id}`);
        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Erro ao buscar estoque-produto: ${response.status} - ${errorMessage}`);
        }

        const estoqueProduto = await response.json();
        const estoque = await fetchEstoqueByID(estoqueProduto.idEstoque);
        const produto = await fetchProdutoByID(estoqueProduto.idProduto);
        estoqueInput.value = `${estoque.nome} - ${estoqueProduto.idEstoque}` || '';
        produtoInput.value = `${produto.nomeProduto} - ${estoqueProduto.idProduto}` || '';
        quantidadeInput.value = estoqueProduto.quantidade || '';

    } catch (error) {
        console.error('Erro ao buscar estoque-produto:', error);
        toast('error','Erro ao buscar os dados do estoque-produto. Tente novamente.');
        modal.style.display = 'none';
        return;
    }

    const salvarEdicaoButton = document.getElementById('salvarEstoqueProdutoEdicao');
    salvarEdicaoButton.onclick = async () => {
        const estoqueValue = estoqueInput.value.trim();
        const produtoValue = produtoInput.value.trim();
        const quantidade = quantidadeInput.value.trim();
        const dataAtualizacao = new Date().toISOString();

        if (!estoqueValue || !produtoValue || !quantidade) {
            toast('error','Por favor, preencha todos os campos.');
            return;
        }

        const idEstoque = estoqueValue.split(" - ")[1];
        const idProduto = produtoValue.split(" - ")[1];

        try {
            const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque_Produto/atualizar-estoque-produto`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idEstoque_Produto: parseInt(id),
                    idEstoque: parseInt(idEstoque),
                    idProduto: parseInt(idProduto),
                    quantidade: parseInt(quantidade),
                    dataAtualizacao: dataAtualizacao
                })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error(`Erro ao editar estoque-produto: ${response.status} - ${errorMessage}`);
            }
            // Toastify({
            //     text: "Produto no estoque cadastrado com sucesso!",
            //     className: "info",
            //     style: {
            //       background: "linear-gradient(to right,  #711e92, #5b087c)",
            //     }
            //   }).showToast();
            toast('success','Estoque-produto editado com sucesso!');
            fetchEstoqueProdutos();
            modal.style.display = 'none';
        } catch (error) {
            console.error('Erro ao editar estoque-produto:', error);
            toast('error','Erro ao editar estoque-produto. Tente novamente.');
        }
    };
}

async function excluirEstoque_Produto(element) {
    let id = element.getAttribute('data-id');

    const confirmacao = confirm("Tem certeza que deseja excluir este estoque?");
    if (!confirmacao) {
        return;
    }

    try {
        const response = await fetch(`https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque_Produto/remover-estoque-produto/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Erro ao excluir estoque: ${response.status} - ${errorMessage}`);
        }

        toast('success','Produto de estoque excluído com sucesso!');
        fetchEstoqueProdutos();

    } catch (error) {
        console.error('Erro ao excluir estoque:', error);
        toast('error','Erro ao excluir o estoque. Tente novamente.');
    }
}

async function pesquisarEstoque() {
    const pesquisaInput = document.getElementById('pesquisaEstoque').value.trim();
    const filtro = document.getElementById('filtroEstoque').value;

    if (!pesquisaInput) {
        fetchEstoqueProdutos();
        return;
    }

    let url;

    if (filtro === 'id') {
        if (!isNaN(pesquisaInput)) {
            url = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque_Produto/buscar-estoque-produto-por-id/${pesquisaInput}`;
        } else {
            toast('error','Por favor, insira um ID válido.');
            return;
        }
    } else if (filtro === 'idEstoque') {
        url = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque_Produto/buscar-estoque-por-id-estoque/${pesquisaInput}`;
    } else if (filtro === 'idProduto') {
        url = `https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Estoque_Produto/buscar-produto-por-id-produto/${pesquisaInput}`;
    }

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            console.error(`Erro ao acessar API: ${resposta.status}`);
        }

        const estoques = await resposta.json();
        const tbody = document.querySelector('#estoque-produto-container');
        tbody.innerHTML = '';

        if (!estoques || estoques.length === 0) {
            toast('error','Nenhum estoque encontrado.');
            return;
        }

        if (filtro === 'id') {
            pesquisarEstoqueId(estoques);
        } else {
            pesquisarEstoqueFiltro(estoques);
        }
    } catch (erro) {
        console.error('Erro ao buscar estoque:', erro);
        toast('error','Erro ao buscar estoque.');
    }
}

async function pesquisarEstoqueId(estoques) {
    const tbody = document.querySelector('#estoque-produto-container');
    const row = document.createElement('tr');
    row.innerHTML = `
    <th scope="row">${estoques.idEstoque_Produto}</th>
    <td>${estoques.idEstoque}</td>
    <td>${estoques.idProduto}</td>
    <td>${estoques.quantidade}</td>
    <td>
        <ion-icon name="create-outline" class="button-edit" data-id="${estoques.idEstoque_Produto}" onclick="editarEstoqueProduto(this)">Editar</ion-icon>
        <ion-icon name="trash" class="button-delete" data-id='${estoques.idEstoque_Produto}' onclick="excluirEstoque_Produto(this)">Apagar</ion-icon>
    </td>`;
    tbody.appendChild(row);
    substituirIDPorNomeEstoque();
    substituirIDPorNomeProduto();
}

async function pesquisarEstoqueFiltro(estoques) {
    const tbody = document.querySelector('#estoque-produto-container');
    estoques.forEach(estoque => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <th scope="row">${estoque.idEstoque_Produto}</th>
        <td>${estoque.idEstoque}</td>
        <td>${estoque.idProduto}</td>
        <td>${estoque.quantidade}</td>
        <td>
            <ion-icon name="create-outline" class="button-edit" data-id="${estoque.idEstoque_Produto}" onclick="editarEstoqueProduto(this)">Editar</ion-icon>
            <ion-icon name="trash" class="button-delete" data-id='${estoque.idEstoque_Produto}' onclick="excluirEstoque_Produto(this)">Apagar</ion-icon>
        </td>`;
        tbody.appendChild(row);
    });
    substituirIDPorNomeEstoque();
    substituirIDPorNomeProduto();
}

window.onload = iniciandoAutocompletes;
if (window.location.pathname.includes('listagemEstoqueProduto.html')) {//IF necessário para a página rodar(depois separar em arquivos diferentes)
    window.onload = fetchEstoqueProdutos;
}
// window.onload = substituirIDPorNomeEstoque;


/===== TOAST  =====/
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