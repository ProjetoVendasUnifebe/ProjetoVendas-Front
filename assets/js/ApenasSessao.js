const RedirecionaSeNaoEstiverLogado = () => {
    const token = sessionStorage.getItem("Token")

    if (!token) {
        location.href = "../login.html"
    }

    const parsedToken = JSON.parse(token)
    const dataExpiracao = new Date(parsedToken.dataExpiracao)
    const agora = new Date()

    if (dataExpiracao < agora) {
        location.href = "/login.html"

    }

}

RedirecionaSeNaoEstiverLogado()
