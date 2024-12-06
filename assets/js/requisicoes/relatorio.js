
const url = 'https://vendas-comercialize-a0fqhjhne5cagkc5.brazilsouth-01.azurewebsites.net/Views/'
let grafico = null;

async function buscarRelatorios() {
    const filtro = parseInt(document.getElementById('filtro').value);
    switch (filtro) {

        case 1:
            buscarClienteCompra();
            break;

        case 2:
            buscarProdutosVendidos();
            break;

        case 3:
            buscarFaturamento();
            break;

        case 4:
            buscarVendas();
            break;

    }
}

async function buscarClienteCompra() {

    const ordenacao = document.getElementById('ordenacao').value.trim();
    const nome = document.getElementById('nome').value.trim();
    let urlClienteCompra = ''
    let mostrouMensagem = false

    if (ordenacao && nome) {
        urlClienteCompra += url + `buscar-clientes-com-compras?ordenacao=${ordenacao}&nomeCliente=${nome}`
    } else if (ordenacao && !nome) {
        urlClienteCompra += url + `buscar-clientes-com-compras?ordenacao=${ordenacao}`
    } else if (!ordenacao && nome) {
        urlClienteCompra += url + `buscar-clientes-com-compras?nomeCliente=${nome}`
    } else {
        urlClienteCompra += url + `buscar-clientes-com-compras`
    }

    try {
        const resposta = await fetch(urlClienteCompra);

        if (!resposta.ok) {
            toast("error", "Erro de requisição");
            mostrouMensagem = true
        }

        const Cliente = await resposta.json();


        criarGraficoCliente(Cliente);

    } catch (erro) {

        if (!mostrouMensagem) {
            toast("error", "Cliente não existe");
        }

        if (grafico) {
            grafico.destroy();
        }
    }

}
async function buscarProdutosVendidos() {

    const ordenacao = document.getElementById('ordenacao').value.trim();
    const nome = document.getElementById('nome').value.trim();
    let urlProduto = ''
    let mostrouMensagem = false

    if (ordenacao && nome) {
        urlProduto += url + `buscar-produtos-vendidos?ordenacao=${ordenacao}&nomeProduto=${nome}`
    } else if (ordenacao && !nome) {
        urlProduto += url + `buscar-produtos-vendidos?ordenacao=${ordenacao}`
    } else if (!ordenacao && nome) {
        urlProduto += url + `buscar-produtos-vendidos?nomeProduto=${nome}`
    } else {
        urlProduto += url + `buscar-produtos-vendidos`
    }

    try {
        const resposta = await fetch(urlProduto);

        if (!resposta.ok) {
            toast("error", "Erro de requisição");
            mostrouMensagem = true
        }

        const Produto = await resposta.json();


        criarGraficoProduto(Produto);

    } catch (erro) {

        if (!mostrouMensagem) {
            toast("error", "Produto não existe");
        }

        if (grafico) {
            grafico.destroy();
        }
    }

}
async function buscarFaturamento() {

    const mes = document.getElementById('mes').value.trim();
    const ano = document.getElementById('ano').value.trim();
    let urlFaturamento = ''
    let mostrouMensagem = false

    if (mes && ano) {
        urlFaturamento += url + `buscar-faturamento?mes=${mes}&ano=${ano}`
    } else if (mes && !ano) {
        urlFaturamento += url + `buscar-faturamento?mes=${mes}`
    } else if (!mes && ano) {
        urlFaturamento += url + `buscar-faturamento?ano=${ano}`
    } else {
        urlFaturamento += url + `buscar-faturamento`
    }

    try {
        const resposta = await fetch(urlFaturamento);

        if (!resposta.ok) {
            toast("error", "Erro de requisição");
            mostrouMensagem = true
        }

        const Faturamento = await resposta.json();


        criarGraficoFaturamento(Faturamento);

    } catch (erro) {

        if (!mostrouMensagem) {
            toast("error", "Ano/mês inválido");
        }

        if (grafico) {
            grafico.destroy();
        }
    }


}
async function buscarVendas() {

    const urlVendas = url + 'buscar-vendas-finalizadas'
    let mostrouMensagem = false
    try {
        const resposta = await fetch(urlVendas);

        if (!resposta.ok) {
            toast("error", "Erro de requisição");
            mostrouMensagem = true
        }

        const Vendas = await resposta.json();


        criarGraficoVenda(Vendas);

    } catch (erro) {

        if (!mostrouMensagem) {
            toast("error", "Erro de requisição");
        }

        if (grafico) {
            grafico.destroy();
        }
    }

}

async function criarGraficoVenda(json) {


    const DataNomeCliente = json.map(item => item.dataVenda);
    const valorDaVenda = json.map(item => item.valorDaVenda);

    if (grafico) {
        grafico.destroy()
    }

    const canva = document.getElementById('graficoFaturamento').getContext('2d');
    grafico = new Chart(canva, {
        type: 'bar',
        data: {
            labels: DataNomeCliente, // Legendas no eixo X
            datasets: [{
                label: 'Valor da Venda',
                data: valorDaVenda, // Dados no eixo Y
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}


async function criarGraficoFaturamento(json) {

    const canva = document.getElementById('graficoFaturamento').getContext('2d');
    const anoMes = json.map(item => `${item.ano}/${item.mes}`);
    const faturamento = json.map(item => item.faturamento);

    if (grafico) {
        grafico.destroy()
    }

    grafico = new Chart(canva, {
        type: 'bar',
        data: {
            labels: anoMes, // Legendas no eixo X
            datasets: [{
                label: 'Valor da Venda',
                data: faturamento, // Dados no eixo Y
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}

async function criarGraficoProduto(json) {

    const canva = document.getElementById('graficoFaturamento').getContext('2d');
    const produto = json.map(item => item.nomeProduto);
    const faturamento = json.map(item => item.valorTotal);

    if (grafico) {
        grafico.destroy()
    }

    grafico = new Chart(canva, {
        type: 'bar',
        data: {
            labels: produto, // Legendas no eixo X
            datasets: [{
                label: 'Valor da Venda',
                data: faturamento, // Dados no eixo Y
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}

async function criarGraficoCliente(json) {

    const canva = document.getElementById('graficoFaturamento').getContext('2d');
    const cliente = json.map(item => item.nomeCliente);
    const numeroDeCompras = json.map(item => item.numeroDeCompras);

    if (grafico) {
        grafico.destroy()
    }

    grafico = new Chart(canva, {
        type: 'bar',
        data: {
            labels: cliente, // Legendas no eixo X
            datasets: [{
                label: 'Total de compras',
                data: numeroDeCompras, // Dados no eixo Y
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// /===== TOAST  =====/
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

function verificaPermissao() {
    const usuario = JSON.parse(sessionStorage.getItem("DadosUsuario"));
    if (usuario.ehAdm !== 1) {
        let searchButton = document.getElementById('searchButton')
        searchButton.onclick = function () {
            toast("error", "Você não tem permissão para acessar aos relatórios");
        }
    }
}

window.onload = verificaPermissao;