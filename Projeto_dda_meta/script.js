// Seleciona o formulário pelo ID
const formulario = document.getElementById("login");

// Adiciona o evento de envio (submit)
formulario.addEventListener("submit", function (event) {
    // Evita que a página seja recarregada
    event.preventDefault();

    // Captura os valores digitados nos campos corretos
    const email = document.getElementById("user_email").value;
    const senha = document.getElementById("senha_login").value;
    
    // Exibe os dados capturados no console do navegador
    console.log("Email digitado:", email);
    console.log("Senha digitada:", senha);

    // Aqui você pode adicionar a lógica de validação ou envio para o servidor
    if (email === "admin@dda.com" && senha === "123456") {
        alert("Login realizado com sucesso!");
        // Exemplo: redirecionar para a página de produtos
        // window.location.href = "produtos.html";
    } else {
        alert("Usuário ou senha incorretos.");
    }
});