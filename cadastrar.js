const API_URL = "https://6abaf0395b549d818d62ba15.mockapi.io/ddametalurgica/pastilhas"; 


const formCadastro = document.querySelector('#form-cadastro');

if (formCadastro) {
    formCadastro.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Captura os valores dos campos do formulário
        const codigoIso = document.querySelector('#codigo-iso').value;
        const fabricante = document.querySelector('#fabricante').value;
        const classe = document.querySelector('#classe').value;
        const aplicacaoIso = document.querySelector('#aplicacao-iso').value;
        const quantidadeArestas = parseInt(document.querySelector('#arestas').value);
        const quantidade = parseInt(document.querySelector('#estoque-atual').value);
        const minimo = parseInt(document.querySelector('#estoque-minimo').value);
        const localizacao = document.querySelector('#localizacao').value;

        // Organiza as informações no formato do Schema do no meu MockAPI
        const novaPastilha = {
            codigoIso,
            fabricante,
            classe,
            aplicacaoIso,
            quantidadeArestas,
            quantidade,
            minimo,
            localizacao
        };

        try {
            // Envio dos dados via POST com JSON.stringify()
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novaPastilha)
            });

            // Se a resposta não vier correta, dispara o erro para o catch
            if (!response.ok) throw new Error();

            const dadosRetornados = await response.json();

            alert(`Pastilha ${dadosRetornados.codigoIso} cadastrada com sucesso!`);
            formCadastro.reset();

        } catch (error) {
            console.error("Erro ao enviar dados para API:", error);
            
            alert("Erro ao cadastrar pastilha. Tente novamente.");
        }
    });
}




