
const formulario = document.getElementById("login");

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("user_email").value;
    const senha = document.getElementById("senha_login").value;

    console.log("Email:", email);
    console.log("Senha:", senha);

    if (email === "admin@dda.com" && senha === "123456") {
        alert("Login realizado com sucesso!");
    } else {
        alert("Usuário ou senha incorretos.");
    }



});