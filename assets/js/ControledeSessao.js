//  Inicia a função de criar o token que sera responsavel de verificar as sessoes,e gerenciar as  entradas.
function CriarToken() {
    let token = {
        //Pega a  data para fazer as verificações:
        dataExpiracao: new Date(),
        dataRenovacao: new Date(),
    };

    // Define os tempos de renovação e expiração.
    token.dataRenovacao.setMinutes(token.dataRenovacao.getMinutes() + 10);
    token.dataExpiracao.setHours(token.dataExpiracao.getHours() + 1);
    //O sessionstorage trabalha com stings simples então aqui, e passado o token que esta em tipo "Date", para um json que sera posivel fazer as verificações com as datas.
    sessionStorage.setItem('Token', JSON.stringify(token));


alert("Token criado");

}

function verificarSessao() {
   alert("Sessão verificada");
    //Cria o token para fazer as verificações
    let tokenString = sessionStorage.getItem('Token');
    // É setado a data atual para fazer a comparação com a renovação e expiração.
    let dataAtual = new Date();

    //Faz uma verificação caso há um token já  criado, caso não redireecionado para tela inicial(De login).
    if (!tokenString) {
        sessionStorage.setItem('mostrarMensagem', false);
        window.location.replace = "login.html";
    }


    // O if que vai fazer a checagem de tempo e liberar o token e o acesso.
if (dataAtual < token.dataRenovacao) {
    // Se for verdade o codigo permitira o fluxo normal.
    //Fará a verificação se o token esta perto de ser encerrado(Tempo Limite de inatividade).
}
if (dataAtual >= token.dataRenovacao && dataAtual < token.dataExpiracao) {
    //  Chama a função de renovação do token e define a nova data atual.
    renovarToken(token, dataAtual);
} 
else {
    // Chama a função que encera função e redireciona para a pagina inicial(De login).
    sessaoExpirada();
}
}



//Cria a função que renova o token da sessão.
function renovarToken(token, dataAtual) {
    //Difine a nova data de renovação e de expiração.
    token.dataRenovacao = new Date(dataAtual);
    token.dataRenovacao.setMinutes(dataAtual.getMinutes() + 10);
    token.dataExpiracao = new Date(dataAtual);
    token.dataExpiracao.setHours(dataAtual.getHours() + 1);
    // Memsma coisas de que na criação do token a conversão dele.
    sessionStorage.setItem('Token', JSON.stringify(token));
}
//Cria a função que encerra a sessão da sessão.
function sessaoExpirada() {
    alert("Sessão encerrada");
    //Difine um novo item no sessionstorage.
    sessionStorage.setItem('mostrarMensagem', true);
    //Remove o token que faz as verificações 
    sessionStorage.removeItem('Token');
    //É usado o raplace para automaticamente ser redirecionado para a pagina inicial(De login).
    window.location.replace = "login.html";
}

function Logar(){

    validaLogin();
    CriarToken();
    verificarSessao();


}

function redefinirSenhaUsuario(){

    redefineSenha();

}
Logar();
validaLogin();
redefineSenha();

