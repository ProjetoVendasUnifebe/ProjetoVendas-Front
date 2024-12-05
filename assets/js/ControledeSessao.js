
function CriarToken() {
    let token = {
    
        dataExpiracao: new Date(),
        dataRenovacao: new Date(),
    };

  
    token.dataRenovacao.setMinutes(token.dataRenovacao.getMinutes() + 10);
    token.dataExpiracao.setHours(token.dataExpiracao.getHours() + 1);
    sessionStorage.setItem('Token', JSON.stringify(token));

  
}

function verificarSessao() {
   
    let tokenString = sessionStorage.getItem('Token');
    let token = tokenString ? JSON.parse(tokenString) : null;

    
    let dataAtual = new Date();

    
    if (!token || !token.dataRenovacao || !token.dataExpiracao) {
        sessionStorage.setItem('mostrarMensagem', false);
        window.location.href = "login.html";
        return; 
    }

    token.dataRenovacao = new Date(token.dataRenovacao);
    token.dataExpiracao = new Date(token.dataExpiracao);

    
    if (dataAtual < token.dataRenovacao) {
       
    } else if (dataAtual >= token.dataRenovacao && dataAtual < token.dataExpiracao) {
        
        renovarToken(token, dataAtual);
    } else {
       
        sessaoExpirada();
    }

}



function renovarToken(token, dataAtual) {
    
    token.dataRenovacao = new Date(dataAtual);
    token.dataRenovacao.setMinutes(dataAtual.getMinutes() + 10);
    token.dataExpiracao = new Date(dataAtual);
    token.dataExpiracao.setHours(dataAtual.getHours() + 1);
    
    sessionStorage.setItem('Token', JSON.stringify(token));
}

function sessaoExpirada() {
    
    sessionStorage.setItem('mostrarMensagem', true);
    
    sessionStorage.removeItem('Token');
    
    window.location.href = "login.html";
    
}

function Logar(){

    validaLogin();
    CriarToken();
    verificarSessao();
}
 Logar()


