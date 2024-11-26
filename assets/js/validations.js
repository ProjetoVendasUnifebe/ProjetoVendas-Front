export class Validations{

    validaSenhaUsuario() {
        let senhaUsuario = document.getElementById("senhaUsuario").value;
        let confSenhaUsuario = document.getElementById("confSenhaUsuario").value;
    
        if (senhaUsuario !== confSenhaUsuario) {
            alert("As senhas não conferem!");
            console.log("As senhas não conferem");
            return false;
        } else {
            console.log("As senhas conferem");
            document.querySelector(".cadastro-form").submit();
        }
    }
}